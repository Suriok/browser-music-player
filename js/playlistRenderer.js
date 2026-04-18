export function createTrackElement({
                                       id,
                                       index,
                                       title,
                                       artist,
                                       duration,
                                       file,
                                       coverUrl = null
                                   }) {
    const article = document.createElement("article");
    article.className = "song_num";

    const formattedNumber = String(index).padStart(2, "0");
    const fileURL = URL.createObjectURL(file);

    article.dataset.src = fileURL;
    article.dataset.id = String(id);

    if (coverUrl) {
        article.dataset.cover = coverUrl;
    }

    article.innerHTML = `
        <h3 class="number_song">${formattedNumber}</h3>

        <span class="text_container">
            <span class="song_name">${title}</span>
            <span class="song_artist">${artist}</span>
        </span>

        <time class="song_time">${duration}</time>

        <button class="delete_track_button" type="button" aria-label="Delete track">
            <img src="photo/trash.svg" alt="" aria-hidden="true">
        </button>
    `;

    return article;
}