export function createTrackElement({ index, title, artist, duration, file, coverUrl = null }) {
    const article = document.createElement("article");
    article.className = "song_num";

    const formattedNumber = String(index).padStart(2, "0");
    const fileURL = URL.createObjectURL(file);

    article.innerHTML = `
        <h3 class="number_song">${formattedNumber}</h3>
        <span class="text_container">
            <span class="song_name">${title}</span>
            <span class="song_artist">${artist}</span>
        </span>
        <time class="song_time">${duration}</time>
    `;

    article.dataset.src = fileURL;

    if (coverUrl) {
        article.dataset.cover = coverUrl;
    }

    return article;
}