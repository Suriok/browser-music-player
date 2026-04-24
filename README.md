# Web Player

A modern browser-based music player built with **HTML5**, **CSS3**, and **vanilla JavaScript (ES Modules)**.  
The project focuses on clean UI, modular frontend architecture, local audio playback, playlist interaction, metadata extraction, album artwork handling, and responsive design.

> **Project status:** This project is currently **under active development**.  
> New features, UI improvements, and code refinements are still being added.



## Overview

Web Player is a frontend web application that allows users to upload and play local audio files directly in the browser.  
It provides a compact music player interface with playback controls, a dynamic playlist, real-time search, drag-and-drop upload, and track metadata support.

The goal of the project is not only to create a functional music player, but also to demonstrate practical frontend development skills such as:

- semantic HTML5 structure
- responsive CSS design
- modular JavaScript architecture
- DOM manipulation
- media handling in the browser
- file upload workflows
- metadata extraction from audio files
- interactive UI components



## Features

### Audio Playback
- Play and pause tracks
- Skip to previous or next track
- Seek within the song using the progress bar
- Automatically move to the next track when playback ends

### Playlist Management
- Dynamically render uploaded tracks into the playlist
- Highlight the currently active song
- Store track source and cover data using dataset attributes
- Show track title, artist, and duration

### File Upload
- Upload local audio files directly in the browser
- Support for **MP3** and **WAV**
- Drag-and-drop upload support
- File size validation before adding tracks

### Metadata Extraction
- Read embedded metadata from audio files
- Extract:
  - song title
  - artist
  - album artwork
- Use fallback formatting when metadata is missing

### Search
- Search tracks by title or artist
- Real-time playlist filtering

### UI / UX
- Responsive layout for desktop, tablet, and mobile
- Styled popup window for file upload
- Hover states, transitions, and animations
- Clean dark-themed visual design



## Screenshots

### Main Player
<img width="612" height="620" alt="Main Player" src="https://github.com/user-attachments/assets/9bf28755-3312-4fe0-9c00-f15fafa375b4" />

### Playlist and Search
<img width="460" height="349" alt="Playlist and Search" src="https://github.com/user-attachments/assets/ff1d37dc-5206-4dcf-ba35-8d31ca7bbf53" />

### Upload Popup
<img width="790" height="611" alt="Upload Popup" src="https://github.com/user-attachments/assets/10e59383-e7e1-4071-86f4-0275e661c50f" />



## Demo

You can run the project locally in a browser.

**Live Demo:** Coming soon



## Tech Stack

- **HTML5**
- **CSS3**
- **JavaScript (ES6 Modules)**
- **Browser Audio API / HTMLAudioElement**
- **jsmediatags** for reading audio metadata



## Project Structure

```text
.
├── index.html
├── css
│   ├── style.css
│   └── popUp.css
├── js
│   ├── main.js
│   ├── player.js
│   ├── popup.js
│   ├── dataHandler.js
│   └── search.js
└── photo
````

---

## Architecture

The project is split into separate JavaScript modules to keep responsibilities clear and maintainable.

### `main.js`

Initializes the application modules and starts the main logic.

### `player.js`

Handles:

* audio playback
* progress updates
* switching tracks
* current song information
* active playlist state
* play / pause / next / previous controls

### `dataHandler.js`

Responsible for:

* browsing and selecting files
* drag-and-drop support
* file validation
* metadata reading
* duration extraction
* rendering new tracks into the playlist

### `popup.js`

Controls:

* opening the upload popup
* closing the popup
* outside-click closing behavior

### `search.js`

Implements playlist filtering based on:

* song title
* artist name



## How It Works

1. The user opens the music player in the browser.
2. Audio files can be added through the upload popup.
3. Files are validated by type and size.
4. Metadata is extracted using `jsmediatags` when available.
5. Tracks are dynamically inserted into the playlist.
6. Clicking a playlist item loads the selected track into the player.
7. The interface updates track name, artist, duration, cover image, and playback state.



## HTML / CSS / JavaScript Highlights

This project includes several important frontend concepts.

### HTML

* semantic page structure
* accessible labels for controls
* separation between player and playlist sections
* form-related elements such as search input and file input

### CSS

* responsive layout with media queries
* advanced selectors
* transitions and animations
* dark UI styling
* reusable component classes
* popup and card-style layout styling

### JavaScript

* modular ES module structure
* object-oriented approach using classes
* event-driven UI interactions
* file handling with browser APIs
* metadata extraction from local audio files
* dynamic DOM rendering
* playlist search logic



## Installation

Clone the repository:

```bash
git clone https://github.com/your-username/your-repository-name.git
```

Open the project folder and run it with a local development server.

For example, with VS Code:

* install the **Live Server** extension
* open `index.html`
* start the project with Live Server


## Usage

1. Open the application in the browser.
2. Click the **Add Track** button.
3. Upload audio files or drag and drop them into the popup.
4. Confirm upload.
5. Click any track in the playlist to start playback.
6. Use search to filter songs by title or artist.



## Current Limitations

Because the project is still in development, some features are not fully finished yet.

Current limitations may include:

* playlist is not persisted after page reload
* no backend or cloud storage
* no shuffle or repeat modes yet
* limited audio format support
* limited state persistence
* metadata availability depends on the uploaded file



## Roadmap

Planned improvements for future development:

* persistent playlist storage
* `localStorage` or `IndexedDB` support
* shuffle mode
* repeat mode
* volume control
* drag-to-reorder playlist
* better accessibility support
* keyboard shortcuts
* improved mobile experience
* smoother animations
* better error messages and empty states


