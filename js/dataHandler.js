import { popup } from "./popup.js";

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

    setup() {
        if (this.browseButton && this.audioFileInput) {
            this.browseButton.addEventListener("click", () => {
                this.audioFileInput.click();
            });

            this.audioFileInput.addEventListener("change", (event) => {
                const files = Array.from(event.target.files);
                this.handleFiles(files);
            });
        }

        if (this.dropZone) {
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

        if (this.addSongButton) {
            this.addSongButton.addEventListener("click", async () => {
                await this.addUploadedSongsToPlaylist();
            });
        }
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
            if (this.uploadedFiles.length === 1) {
                this.selectedFiles.textContent = this.formatFileName(this.uploadedFiles[0].name);
            } else {
                this.selectedFiles.textContent = `${this.uploadedFiles.length} files selected`;
            }
        }
    }

    async addUploadedSongsToPlaylist() {
        if (!this.playList || this.uploadedFiles.length === 0) return;

        for (const file of this.uploadedFiles) {
            const trackNumber = this.playList.querySelectorAll(".song_num").length;
            const formattedNumber = String(trackNumber).padStart(2, "0");

            const fileURL = URL.createObjectURL(file);

            const duration = await this.getAudioDuration(fileURL);
            const formattedDuration = this.formatTime(duration);
            const metadata = await this.readAudioMetadata(file);

            const article = document.createElement("article");
            article.className = "song_num";

            article.innerHTML = `
                <h3 class="number_song">${formattedNumber}</h3>
                <span class="text_container">
                    <span class="song_name">${metadata.title}</span>
                    <span class="song_artist">${metadata.artist}</span>
                </span>
                <time class="song_time">${formattedDuration}</time>
            `;

            article.dataset.src = fileURL;

            if (metadata.coverUrl) {
                article.dataset.cover = metadata.coverUrl;
            }

            this.playList.appendChild(article);
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
            const mediaTags = window["jsmediatags"];

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
                    const tagMap = result && result.tags ? result.tags : {};
                    const pictureTag = tagMap.picture;
                    let coverUrl = null;

                    if (pictureTag) {
                        const byteArray = new Uint8Array(pictureTag.data);
                        const blob = new Blob([byteArray], { type: pictureTag.format });
                        coverUrl = URL.createObjectURL(blob);
                    }

                    resolve({
                        title: tagMap.title || this.formatFileName(file.name),
                        artist: tagMap.artist || (tagMap["TCOM"] && tagMap["TCOM"].data) || "Unknown artist",
                        coverUrl: coverUrl
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