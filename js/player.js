class Player{
    constructor() {
        this.playButton = document.querySelector(".play_button");
        this.prevButton = document.querySelector(".prev_button");
        this.nextButton = document.querySelector(".next_button");
        this.progressBar = document.getElementById("progress");
        this.playListContainer = document.getElementById("playlistContainer");
        this.songName = document.getElementById("currentSongName");
        this.songArtist = document.getElementById("currentSongArtist");
        this.songTime = document.getElementById("currentSongTime");
        this.songCover = document.getElementById("currentSongCover");

        this.audio = new Audio(); // Media Api

        this.currentTrackIndex = -1; // for now any dong is not playing
        this.isPlaying = false;
    }

    setup() {
        this.bindControls(); // buttons
        this.bindAudioEvents(); // events
        this.bindPlaylistEvents(); // Click on songs, playlist
        this.bindHistoryEvents();
        this.restoreLastTrack();
    }


    // CONTROLS SETTINGS
    bindControls() {
        // check if the button exists
        // then add event listener

        if(this.playButton) {
            this.playButton.addEventListener("click", () => {
                this.togglePlay();
            });
        }

        // prev and next buttons
        if(this.prevButton){
            this.prevButton.addEventListener("click", () => {
                this.playPrevious();
            });
        }

        if (this.nextButton){
            this.nextButton.addEventListener("click",() => {
                this.playNext();
            });
        }

        // progress bar, using range input when the user what to manually change the time
        if (this.progressBar){
           this.progressBar.addEventListener("input", () => {
               // if duration is not available, nothing to do
               if(!this.audio.duration) return;

               const progressValue = Number(this.progressBar.value);
               this.audio.currentTime = (progressValue / 100) * this.audio.duration;
           })
        }
    }

    // AUDIO EVENTS
    bindAudioEvents() {
        this.audio.addEventListener("timeupdate", () => {
            this.updateProgress();
        });

        this.audio.addEventListener("loadedmetadata", () => {
            this.updateProgress();
        });

        this.audio.addEventListener("ended", () => {
            this.playNext();
        });
    }

    bindPlaylistEvents() {
        if (!this.playListContainer) return;

        this.playListContainer.addEventListener("click", (event) => {
            if (event.target.closest(".delete_track_button")) {
                return;
            }

            const track = event.target.closest(".song_num");

            if (!track) return;
            if (!track.dataset.src) return;

            const tracks = this.getTracks();
            const clickedTrackIndex = tracks.indexOf(track);

            if (clickedTrackIndex === -1) return;

            this.loadTrack(clickedTrackIndex, { historyMode: "push" });
            void this.play();
        });
    }

    bindHistoryEvents() {
        window.addEventListener("popstate", (event) => {
            this.handlePopState(event);
        });
    }

    getTracks(){
        if (!this.playListContainer) return [];

        // if in code empty article ignore it
        return Array.from(this.playListContainer.querySelectorAll(".song_num"))
            .filter(track => track.dataset.src);
    }

    loadTrack(index, options = {}) {
        const { historyMode = "none" } = options;
        const tracks = this.getTracks();
        const track = tracks[index];

        if (!track) return;

        const src = track.dataset.src; // get url from dataHandler
        const titleName = track.querySelector(".song_name");
        const artistName = track.querySelector(".song_artist");
        const time = track.querySelector(".song_time");
        const cover = track.dataset.cover;

        this.audio.src = src;
        this.currentTrackIndex = index;
        localStorage.setItem("currentTrackIndex", String(index));

        if (this.songName && titleName) {
            this.songName.textContent = titleName.textContent;
        }

        if (this.songArtist && artistName) {
            this.songArtist.textContent = artistName.textContent;
        }

        if (this.songTime && time) {
            this.songTime.textContent = time.textContent;
        }

        if (this.songCover){
            this.songCover.src = cover || "photo/cover.jpg";

            if (titleName) {
                this.songCover.alt = `Album cover for ${titleName.textContent}`;
            } else {
                this.songCover.alt = "Album cover";
            }
        }

        this.updateHistoryForTrack(historyMode);
        this.updateActiveTrack();
    }

    restoreLastTrack() {
        const tracks = this.getTracks();
        const trackFromUrl = this.getTrackIndexFromUrl();

        if (Number.isInteger(trackFromUrl) && trackFromUrl >= 0 && trackFromUrl < tracks.length) {
            this.loadTrack(trackFromUrl, { historyMode: "replace" });
            return;
        }

        const savedIndex = Number(localStorage.getItem("currentTrackIndex"));

        if (!Number.isInteger(savedIndex)) return;
        if (savedIndex < 0 || savedIndex >= tracks.length) return;

        this.loadTrack(savedIndex, { historyMode: "replace" });
    }

    async play() {
        if (!this.audio.src) {
            const tracks = this.getTracks();
            if (tracks.length === 0) return;
            this.loadTrack(0, { historyMode: "replace" });
        }

        try {
            await this.audio.play();
            this.isPlaying = true;
            this.updatePlayButtonIcon();
        } catch (error) {
            console.error("Audio playback failed:", error);
        }
    }

    pause(){
        this.audio.pause();
        this.isPlaying = false;
        this.updatePlayButtonIcon();
    }

    togglePlay(){
        if (!this.audio.src){
            void this.play();
            return;
        }

        if(this.isPlaying){
            this.pause();
        }else{
            void this.play();
        }
    }

    playNext() {
        const tracks = this.getTracks();
        if (tracks.length === 0) return;

        let nextIndex = this.currentTrackIndex + 1;

        if (nextIndex >= tracks.length) {
            nextIndex = 0;
        }

        this.loadTrack(nextIndex, { historyMode: "push" });
        void this.play();
    }

    playPrevious(){
        const tracks = this.getTracks();
        if(tracks.length === 0) return;

        let previousIndex = this.currentTrackIndex - 1;

        if (previousIndex < 0) {
            previousIndex = tracks.length - 1;
        }

        this.loadTrack(previousIndex, { historyMode: "push" });
        void this.play();
    }

    getTrackIndexFromUrl() {
        const url = new URL(window.location.href);
        const trackParam = url.searchParams.get("track");

        if (!trackParam) return null;

        const parsed = Number(trackParam);
        if (!Number.isInteger(parsed)) return null;

        return parsed - 1;
    }

    handlePopState(event) {
        const tracks = this.getTracks();
        if (tracks.length === 0) {
            this.resetPlayer();
            return;
        }

        const stateIndex = event.state?.trackIndex;
        const parsedStateIndex = Number(stateIndex);

        if (Number.isInteger(parsedStateIndex) && parsedStateIndex >= 0 && parsedStateIndex < tracks.length) {
            this.loadTrack(parsedStateIndex);
            void this.play();
            return;
        }

        const trackFromUrl = this.getTrackIndexFromUrl();
        if (!Number.isInteger(trackFromUrl)) {
            this.resetPlayer();
            return;
        }
        if (trackFromUrl < 0 || trackFromUrl >= tracks.length) {
            this.resetPlayer();
            return;
        }

        this.loadTrack(trackFromUrl);
        void this.play();
    }

    updateHistoryForTrack(mode) {
        if (!["push", "replace"].includes(mode)) return;
        if (this.currentTrackIndex < 0) return;

        const url = new URL(window.location.href);
        url.searchParams.set("track", String(this.currentTrackIndex + 1));

        const state = { trackIndex: this.currentTrackIndex };

        if (mode === "push") {
            history.pushState(state, "", url);
            return;
        }

        history.replaceState(state, "", url);
    }

    syncHistoryWithCurrentTrack(mode = "replace") {
        this.updateHistoryForTrack(mode);
    }

    updateProgress() {
        if (this.progressBar && this.audio.duration) {
            this.progressBar.value = (this.audio.currentTime / this.audio.duration) * 100;
        }

        if (this.songTime) {
            const currentTime = this.formatTime(this.audio.currentTime || 0);
            const total = this.formatTime(this.audio.duration || 0);
            this.songTime.textContent = `${currentTime} / ${total}`;
        }
    }

    updateActiveTrack(){
        const tracks = this.getTracks();

        tracks.forEach((track, index) => {
            if (index === this.currentTrackIndex) {
                track.classList.add("active_track");
            } else {
                track.classList.remove("active_track");
            }
        });
    }

    updatePlayButtonIcon() {
        const icon = this.playButton?.querySelector("img");
        if (!icon) return;

        if (this.isPlaying) {
            icon.src = "photo/pause.svg";
            icon.alt = "Pause";
        } else {
            icon.src = "photo/play.svg";
            icon.alt = "Play";
        }
    }

    formatTime(seconds) {
        if (!seconds || !isFinite(seconds)) return "0:00";

        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);

        return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
    }

    resetPlayer() {
        this.audio.pause();
        this.audio.src = "";

        this.currentTrackIndex = -1;
        this.isPlaying = false;

        localStorage.removeItem("currentTrackIndex");
        this.clearTrackFromUrl();

        if (this.songName) {
            this.songName.textContent = "Midnight Glow";
        }

        if (this.songArtist) {
            this.songArtist.textContent = "Neon Waves";
        }

        if (this.songTime) {
            this.songTime.textContent = "3:42";
        }

        if (this.songCover) {
            this.songCover.src = "photo/album.jpg";
            this.songCover.alt = "Album cover";
        }

        if (this.progressBar) {
            this.progressBar.value = 0;
        }

        this.updatePlayButtonIcon();
    }

    clearTrackFromUrl() {
        const url = new URL(window.location.href);
        url.searchParams.delete("track");
        history.replaceState({}, "", url);
    }
}

export const player = new Player();
