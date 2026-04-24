import {popup} from "./popup.js";
import {trackStorage} from "./storage.js";
import {createTrackElement} from "./playlistRenderer.js";
import {player} from "./player.js";

class DataHandler {
    constructor() {
        this.browseButton = document.querySelector(".browse_button");
        this.audioFileInput = document.getElementById("audioFileInput");
        this.dropZone = document.getElementById("drop_zone");
        this.uploadForm = document.getElementById("drop_zone");
        this.selectedFiles = document.getElementById("selectedFileText");
        this.addSongButton = document.getElementById("confirmUploadButton");
        this.playList = document.getElementById("playlistContainer");

        this.browseError = document.getElementById("browseError");

        this.uploadedFiles = [];
    }

    // Attach upload handlers and restore persisted playlist.
    async setup() {
        this.bindBrowseInput();
        this.bindDropZone();
        this.bindAddSongButton();
        await this.restoreTracksFromStorage();
        this.bindDeleteTrack();
    }

    // Process files selected via native file input.
    bindBrowseInput() {
        if (!this.audioFileInput) return;

        this.audioFileInput.addEventListener("change", (event) => {
            const files = Array.from(event.target.files);
            this.handleFiles(files);
        });
    }

    // Handle drag-and-drop upload area interactions.
    bindDropZone() {
        if (!this.dropZone) return;

        this.dropZone.addEventListener("dragover", (event) => {
            event.preventDefault();
            this.dropZone.classList.add("dragover");
        });

        this.dropZone.addEventListener("dragleave", () => {
            this.dropZone.classList.remove("dragover");
        });

        this.dropZone.addEventListener("drop", (event) => {
            event.preventDefault();
            this.dropZone.classList.remove("dragover");

            const files = Array.from(event.dataTransfer.files);
            this.handleFiles(files);
        });
    }

    // Validate and submit files to playlist.
    bindAddSongButton() {
        if (!this.uploadForm) return;

        if (this.addSongButton) {
            this.addSongButton.addEventListener("click", (event) => {
                if (navigator.onLine) return;

                event.preventDefault();
                event.stopPropagation();
                this.showOfflineUploadError();
            });
        }

        this.uploadForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            if (!this.audioFileInput) return;

            if (!navigator.onLine) {
                this.showOfflineUploadError();
                return;
            }

            if (this.uploadedFiles.length === 0) {
                if (this.browseError) this.browseError.classList.remove("hidden");
                return;
            }

            this.audioFileInput.setCustomValidity("");
            await this.addUploadedSongsToPlaylist();
        });
    }

    showOfflineUploadError() {
        if (this.audioFileInput) {
            this.audioFileInput.setCustomValidity(
                "You cannot add songs while the app is offline. Please reconnect to the internet."
            );
            this.audioFileInput.reportValidity();
        }

        alert("You cannot add songs while the app is offline. Please reconnect to the internet.");
    }

    // Validate file type/size and keep only accepted audio files.
    handleFiles(files) {
        const maxSize = 50 * 1024 * 1024;
        const allowedTypes = ["audio/mpeg", "audio/wav", "audio/x-wav"];
        const validatedFiles = [];
        let validationError = "";

        files.forEach((file) => {
            if (!allowedTypes.includes(file.type)) {
                if (!validationError) {
                    validationError = `File "${file.name}" is not MP3 or WAV.`;
                }
                return;
            }

            if (file.size > maxSize) {
                if (!validationError) {
                    validationError = `File "${file.name}" is larger than 50MB.`;
                }
                return;
            }

            validatedFiles.push(file);
        });

        if (validatedFiles.length === 0) {
            if (this.audioFileInput) {
                this.audioFileInput.setCustomValidity(
                    validationError || "Please select a valid MP3 or WAV file."
                );
                this.audioFileInput.reportValidity();
            }
            return;
        }

        if (this.audioFileInput) {
            this.audioFileInput.setCustomValidity("");
        }

        if (this.browseError) this.browseError.classList.add("hidden");

        this.uploadedFiles = [...this.uploadedFiles, ...validatedFiles];

        if (this.selectedFiles) {
            this.selectedFiles.textContent =
                this.uploadedFiles.length === 1
                    ? this.formatFileName(this.uploadedFiles[0].name)
                    : `${this.uploadedFiles.length} files selected`;
        }
    }

    // Save uploaded tracks and append them to UI.
    async addUploadedSongsToPlaylist() {
        if (!this.playList || this.uploadedFiles.length === 0) return;

        for (const file of this.uploadedFiles) {
            const metadata = await this.readAudioMetadata(file);
            const fileURL = URL.createObjectURL(file);
            const duration = await this.getAudioDuration(fileURL);
            const formattedDuration = this.formatTime(duration);

            const trackData = {
                file,
                title: metadata.title,
                artist: metadata.artist,
                duration: formattedDuration,
            };

            const trackId = await trackStorage.saveTrack(trackData);

            this.appendTrackToPlaylist({
                id: trackId,
                ...trackData,
                coverUrl: metadata.coverUrl
            });
        }

        this.uploadedFiles = [];

        if (this.selectedFiles) {
            this.selectedFiles.textContent = "No file selected";
        }

        if (this.audioFileInput) {
            this.audioFileInput.value = "";
            this.audioFileInput.setCustomValidity("");
        }

        if (this.browseError) this.browseError.classList.add("hidden");

        popup.close();
    }

    // Rebuild playlist from IndexedDB after page reload.
    async restoreTracksFromStorage() {
        if (!this.playList) return;

        const storedTracks = await trackStorage.getAllTracks();

        for (const track of storedTracks) {
            const metadata = await this.readAudioMetadata(track.file);

            this.appendTrackToPlaylist({
                ...track,
                coverUrl: metadata.coverUrl
            });
        }
    }

    appendTrackToPlaylist(track) {
        if (!this.playList) return;

        const index = this.playList.querySelectorAll(".song_num").length + 1;

        const trackElement = createTrackElement({
            id: track.id,
            index,
            title: track.title,
            artist: track.artist,
            duration: track.duration,
            file: track.file,
            coverUrl: track.coverUrl
        });

        this.playList.appendChild(trackElement);
    }

    getAudioDuration(fileURL) {
        return new Promise((resolve) => {
            const audio = document.createElement("audio");
            audio.src = fileURL;

            audio.addEventListener("loadedmetadata", () => {
                resolve(audio.duration || 0);
            });

            audio.addEventListener("error", () => {
                resolve(0);
            });
        });
    }

    readAudioMetadata(file) {
        return new Promise((resolve) => {
            const mediaTags = window.jsmediatags;

            if (!mediaTags) {
                resolve({
                    title: this.formatFileName(file.name),
                    artist: "Unknown artist",
                    coverUrl: null
                });
                return;
            }

            mediaTags.read(file, {
                onSuccess: (result) => {
                    const tagMap = result?.tags || {};
                    const pictureTag = tagMap.picture;
                    let coverUrl = null;
                    const title = this.getFirstNonEmptyTagValue(tagMap, [
                        "title",
                        "TIT2"
                    ]) || this.formatFileName(file.name);
                    const artist = this.getFirstNonEmptyTagValue(tagMap, [
                        "artist",
                        "albumartist",
                        "albumArtist",
                        "performer",
                        "performers",
                        "band",
                        "author",
                        "composer",
                        "TPE1",
                        "TPE2",
                        "TCOM"
                    ]) || "Unknown artist";

                    if (pictureTag) {
                        const byteArray = new Uint8Array(pictureTag.data);
                        const blob = new Blob([byteArray], { type: pictureTag.format });
                        coverUrl = URL.createObjectURL(blob);
                    }

                    resolve({
                        title,
                        artist,
                        coverUrl
                    });
                },
                onError: () => {
                    resolve({
                        title: this.formatFileName(file.name),
                        artist: "Unknown artist",
                        coverUrl: null
                    });
                }
            });
        });
    }

    getFirstNonEmptyTagValue(tagMap, keys) {
        for (const key of keys) {
            const normalized = this.normalizeTagValue(tagMap[key]);
            if (normalized) return normalized;
        }

        return "";
    }

    normalizeTagValue(value) {
        if (typeof value === "string") {
            return value.trim();
        }

        if (Array.isArray(value)) {
            return value
                .map((item) => this.normalizeTagValue(item))
                .filter(Boolean)
                .join(", ")
                .trim();
        }

        if (!value || typeof value !== "object") {
            return "";
        }

        if (typeof value.text === "string") {
            return value.text.trim();
        }

        if (typeof value.data === "string") {
            return value.data.trim();
        }

        return "";
    }

    formatTime(seconds) {
        if (!seconds || !isFinite(seconds)) return "--:--";

        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);

        return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
    }

    formatFileName(fileName) {
        return fileName
            .replace(/\.[^/.]+$/, "")
            .replace(/[_-]+/g, " ")
            .replace(/\s+/g, " ")
            .trim();
    }

    renumberTracks() {
        if (!this.playList) return;

        const tracks = this.playList.querySelectorAll(".song_num");

        tracks.forEach((track, index) => {
            const numberElement = track.querySelector(".number_song");
            if (numberElement) {
                numberElement.textContent = String(index + 1).padStart(2, "0");
            }
        });
    }

    bindDeleteTrack() {
        if (!this.playList) return;

        this.playList.addEventListener("click", async (event) => {
            const deleteButton = event.target.closest(".delete_track_button");
            if (!deleteButton) return;

            const trackElement = deleteButton.closest(".song_num");
            if (!trackElement) return;

            const trackId = Number(trackElement.dataset.id);
            if (!trackId) return;

            const allTracksBeforeDelete = Array.from(
                this.playList.querySelectorAll(".song_num")
            );

            const deletedTrackIndex = allTracksBeforeDelete.indexOf(trackElement);
            const isDeletingCurrentTrack = deletedTrackIndex === player.currentTrackIndex;

            await trackStorage.deleteTrack(trackId);

            const trackSrc = trackElement.dataset.src;
            if (trackSrc) {
                URL.revokeObjectURL(trackSrc);
            }

            trackElement.remove();
            this.renumberTracks();

            const remainingTracks = this.playList.querySelectorAll(".song_num");

            if (isDeletingCurrentTrack) {
                if (remainingTracks.length === 0) {
                    player.resetPlayer();
                    return;
                }

                const newIndex =
                    deletedTrackIndex >= remainingTracks.length
                        ? remainingTracks.length - 1
                        : deletedTrackIndex;

                player.loadTrack(newIndex, { historyMode: "replace" });
                player.pause();
            } else if (deletedTrackIndex < player.currentTrackIndex) {
                player.currentTrackIndex -= 1;
                localStorage.setItem("currentTrackIndex", String(player.currentTrackIndex));
                player.syncHistoryWithCurrentTrack("replace");
            }
        });
    }
}

export const dataHandler = new DataHandler();
