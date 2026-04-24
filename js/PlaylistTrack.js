class PlaylistTrack extends HTMLElement {
    // Render a single playlist row from data-* attributes.
    connectedCallback() {
        const index = String(this.dataset.index).padStart(2, "0");
        const title = this.dataset.title ?? "";
        const artist = this.dataset.artist ?? "";
        const duration = this.dataset.duration ?? "";

        const number = document.createElement("h3");
        number.className = "number_song";
        number.textContent = index;

        const songName = document.createElement("span");
        songName.className = "song_name";
        songName.textContent = title;

        const songArtist = document.createElement("span");
        songArtist.className = "song_artist";
        songArtist.textContent = artist;

        const textContainer = document.createElement("span");
        textContainer.className = "text_container";
        textContainer.append(songName, songArtist);

        const time = document.createElement("time");
        time.className = "song_time";
        time.textContent = duration;

        const trashImg = document.createElement("img");
        trashImg.src = "photo/trash.svg";
        trashImg.alt = "";
        trashImg.setAttribute("aria-hidden", "true");

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete_track_button";
        deleteBtn.type = "button";
        deleteBtn.setAttribute("aria-label", "Delete track");
        deleteBtn.appendChild(trashImg);

        this.append(number, textContainer, time, deleteBtn);
    }
}

customElements.define("playlist-track", PlaylistTrack);
