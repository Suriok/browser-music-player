class PlaylistSearch {
    constructor() {
        this.searchInput = document.getElementById("playlistSearch");
        this.playlistContainer = document.getElementById("playlistContainer");
    }

    // Attach search input listener.
    setup() {
        if (!this.searchInput || !this.playlistContainer) return;

        this.searchInput.addEventListener("input", () => {
            this.filterTracks();
        });
    }

    // Filter playlist rows by title or artist.
    filterTracks() {
        const query = this.searchInput.value.toLowerCase().trim();
        const tracks = this.playlistContainer.querySelectorAll(".song_num");

        tracks.forEach((track) => {
            const titleElement = track.querySelector(".song_name");
            const artistElement = track.querySelector(".song_artist");

            const title = titleElement ? titleElement.textContent.toLowerCase() : "";
            const artist = artistElement ? artistElement.textContent.toLowerCase() : "";

            const isMatch = title.includes(query) || artist.includes(query);

            track.style.display = isMatch ? "" : "none";
        });
    }
}

export const playlistSearch = new PlaylistSearch();
