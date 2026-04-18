import { popup } from "./popup.js";
import { trackStorage } from "./storage.js";
import { createTrackElement } from "./playlistRenderer.js";

class DataHandler {
    constructor() {
        this.browseButton = document.querySelector(".browse_button");
        this.audioFileInput = document.getElementById("audioFileInput");
        this.dropZone = document.getElementById("drop_zone");
        this.selectedFiles = document.getElementById("selectedFileText");
        this.addSongButton = document.getElementById("confirmUploadButton");
        this.playList = document.getElementById("playlistContainer");

        this.uploadedFiles = [];
    }

    async setup() {
        this.bindBrowseInput();
        this.bindDropZone();
        this.bindAddSongButton();
        await this.restoreTracksFromStorage();
    }

    bindBrowseInput() {
        if (!this.browseButton || !this.audioFileInput) return;

        this.browseButton.addEventListener("click", () => {
            this.audioFileInput.click();
        });

        this.audioFileInput.addEventListener("change", (event) => {
            const files = Array.from(event.target.files);
            this.handleFiles(files);
        });
    }

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

    bindAddSongButton() {
        if (!this.addSongButton) return;

        this.addSongButton.addEventListener("click", async () => {
            await this.addUploadedSongsToPlaylist();
        });
    }

    handleFiles(files) {
        const maxSize = 50 * 1024 * 1024;
        const allowedTypes = ["audio/mpeg", "audio/wav", "audio/x-wav"];
        const validatedFiles = [];

        files.forEach((file) => {
            if (!allowedTypes.includes(file.type)) {
                alert(`File "${file.name}" is not MP3 or WAV.`);
                return;
            }

            if (file.size > maxSize) {
                alert(`File "${file.name}" is larger than 50MB.`);
                return;
            }

            validatedFiles.push(file);
        });

        if (validatedFiles.length === 0) return;

        this.uploadedFiles = [...this.uploadedFiles, ...validatedFiles];

        if (this.selectedFiles) {
            this.selectedFiles.textContent =
                this.uploadedFiles.length === 1
                    ? this.formatFileName(this.uploadedFiles[0].name)
                    : `${this.uploadedFiles.length} files selected`;
        }
    }

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

            await trackStorage.saveTrack(trackData);
            this.appendTrackToPlaylist(trackData);
        }

        this.uploadedFiles = [];

        if (this.selectedFiles) {
            this.selectedFiles.textContent = "No file selected";
        }

        if (this.audioFileInput) {
            this.audioFileInput.value = "";
        }

        popup.close();
    }

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

                    if (pictureTag) {
                        const byteArray = new Uint8Array(pictureTag.data);
                        const blob = new Blob([byteArray], { type: pictureTag.format });
                        coverUrl = URL.createObjectURL(blob);
                    }

                    resolve({
                        title: tagMap.title || this.formatFileName(file.name),
                        artist: tagMap.artist || "Unknown artist",
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
}

export const dataHandler = new DataHandler();