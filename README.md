# VibeMusic

Modern web music player built with HTML, CSS, and Vanilla JavaScript.  
The app lets users upload local audio files, read metadata, play tracks, manage a playlist, and keep data between sessions.

## Demo Scope

- Upload MP3/WAV files (drag & drop or file picker)
- Extract metadata (title, artist, cover) from audio tags
- Play/Pause/Next/Previous controls
- Seek with progress bar
- Search tracks in playlist
- Delete tracks from playlist
- Persist playlist in IndexedDB
- Sync active track with URL history (`?track=...`)
- Basic offline behavior via Service Worker

## Tech Stack

- HTML5 (semantic structure, forms, accessibility attributes)
- CSS3 (responsive layout, transitions, animations, media queries)
- JavaScript ES Modules (class-based architecture)
- Web Components (`<playlist-track>`)
- IndexedDB + LocalStorage
- Service Worker + Cache API (PWA shell caching)
- `jsmediatags` (metadata extraction from audio files)

## Project Goal

Create a browser-based music player without backend dependencies, focused on:

- local file playback,
- clean user experience,
- persistent data storage,
- offline-ready shell behavior.

## How It Works

1. `js/main.js` initializes popup, data layer, player, search, clouds, and service worker.
2. `js/dataHandler.js` validates files, reads metadata, computes duration, stores tracks.
3. `js/storage.js` persists/retrieves tracks from IndexedDB (`skyTuneDB`).
4. `js/playlistRenderer.js` + `js/PlaylistTrack.js` render each track as custom element.
5. `js/player.js` handles playback, UI sync, and History API navigation.
6. `js/sw.js` caches app shell and serves cached content in offline mode.

## Metadata Rules

- Artist and cover are added only if these fields exist in audio metadata.
- If metadata is missing, fallback values are used (for example: unknown artist).

## Internet Requirement for Upload

Track upload is blocked when internet is unavailable.  
The app shows an error asking the user to reconnect before adding songs.

## Project Structure

```text
sem/
├─ index.html
├─ manifest.webmanifest
├─ README.md
├─ README2.0.md
├─ css/
│  ├─ style.css
│  └─ popUp.css
├─ js/
│  ├─ main.js
│  ├─ dataHandler.js
│  ├─ player.js
│  ├─ search.js
│  ├─ storage.js
│  ├─ playlistRenderer.js
│  ├─ PlaylistTrack.js
│  ├─ popup.js
│  ├─ cloud.js
│  └─ sw.js
└─ photo/
   ├─ *.svg
   ├─ *.jpg
   └─ finn.png
```

## Screenshots

### Main Player
<img width="428" height="753" alt="Снимок экрана 2026-04-25 004129" src="https://github.com/user-attachments/assets/b9c48061-2c29-4da2-a123-d1a77f9aba0b" />


### Playlist and Search
<img width="434" height="140" alt="Снимок экрана 2026-04-25 004210" src="https://github.com/user-attachments/assets/6fa26b5d-3e72-4e7f-9562-d799185fb674" />


### Upload Popup
<img width="615" height="544" alt="Снимок экрана 2026-04-25 004145" src="https://github.com/user-attachments/assets/93a5f708-6eb4-49d8-86c8-408fe571d8c1" />


## Known Limitations

- Service worker cache list references `photo/pwa-icon.svg` which should exist for full PWA icon support.
- Upload currently depends on internet availability by project rule.

## Roadmap

- Volume control, repeat, shuffle
- Drag-sort playlist
- Improved cache strategy (stale-while-revalidate)
- Better memory cleanup for generated object URLs

## License

Educational project.
