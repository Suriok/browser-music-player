import "./PlaylistTrack.js";

// Build playlist custom element and attach track metadata.
export function createTrackElement({
                                       id,
                                       index,
                                       title,
                                       artist,
                                       duration,
                                       file,
                                       coverUrl = null
                                   }) {
    const el = document.createElement("playlist-track");
    el.className = "song_num";

    const fileURL = URL.createObjectURL(file);
    el.dataset.src = fileURL;
    el.dataset.id = String(id);
    el.dataset.index = String(index);
    el.dataset.title = title;
    el.dataset.artist = artist;
    el.dataset.duration = duration;

    if (coverUrl) {
        el.dataset.cover = coverUrl;
    }

    return el;
}
