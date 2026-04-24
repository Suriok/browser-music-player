# VibeMusic (Web Player)

VibeMusic je klientská webová aplikace pro přehrávání lokálních audio souborů (MP3/WAV) s playlistem, vyhledáváním, ukládáním skladeb do prohlížeče a částečnou offline podporou přes Service Worker.

## Cíl projektu

Cílem projektu je vytvořit moderní hudební přehrávač běžící čistě v prohlížeči bez backendu, který:

- umožní nahrát vlastní skladby metodou drag & drop nebo přes výběr souborů,
- přečte metadata skladeb (název, interpret, obal alba),
- nabídne základní ovládání přehrávání (play/pause, další/předchozí, progress bar),
- uloží playlist mezi relacemi v IndexedDB,
- zůstane použitelný i při výpadku připojení díky PWA prvkům.

## Co je v projektu hotové

- UI přehrávače + playlist + popup pro upload souborů.
- Validace uploadu (formát MP3/WAV, limit 50 MB na soubor).
- Čtení ID3 metadat přes `jsmediatags` (včetně cover obrázku, pokud je v souboru).
- Autor a obálka se doplní pouze tehdy, pokud jsou tyto údaje dostupné v metadatech audio souboru.
- Ukládání skladeb do `IndexedDB` (`skyTuneDB`, store `tracks`).
- Vyhledávání skladeb v playlistu podle názvu nebo interpreta.
- Mazání skladeb z playlistu i databáze.
- Navigace mezi skladbami, zvýraznění aktivní skladby, aktualizace progress baru.
- Synchronizace stavu skladby s URL (`?track=`) + podpora historie prohlížeče (`pushState/popstate`).
- Registrace Service Workeru a cache app shellu.
- Animované SVG mraky na pozadí.

## Použité technologie

- HTML5 (semantické prvky, formuláře, ARIA atributy).
- CSS3 (responsive layout, animace, media queries, moderní selektory).
- Vanilla JavaScript (ES Modules, třídy, Web APIs).
- Web Components (`<playlist-track>` vlastní element).
- IndexedDB (persistované ukládání skladeb).
- Service Worker + Cache API (offline režim/PWA shell).
- Web App Manifest (`manifest.webmanifest`).
- `jsmediatags` (CDN: metadata audio souborů).

## Jak aplikace funguje

1. `js/main.js` inicializuje moduly: popup, data handler, player, search, cloud animace a registraci SW.
2. `dataHandler` načte uložené skladby z IndexedDB a vyrenderuje je do playlistu.
3. Uživatel může přidat skladby (drop/browse), proběhne validace, čtení metadat, výpočet délky a uložení do DB.
4. Každá položka playlistu je renderovaná jako custom element `playlist-track`.
5. `player` řídí audio přehrávání přes `new Audio()`, aktualizuje UI a obsluhuje historii URL.
6. `search` filtruje playlist na klientovi podle textového dotazu.
7. `sw.js` cacheuje app shell a při offline navigaci vrací `index.html`.

## Struktura projektu

```text
sem/
├─ index.html
├─ manifest.webmanifest
├─ README.md
├─ css/
│  ├─ style.css
│  └─ popUp.css
├─ js/
│  ├─ main.js
│  ├─ player.js
│  ├─ dataHandler.js
│  ├─ playlistRenderer.js
│  ├─ PlaylistTrack.js
│  ├─ popup.js
│  ├─ search.js
│  ├─ storage.js
│  ├─ cloud.js
│  └─ sw.js
├─ photo/
│  ├─ *.svg
│  └─ *.jpg
├─ .idea/                 (WebStorm konfigurace projektu)
```

## Instrukce pro spuštění

### Požadavky

- Moderní prohlížeč (Chrome/Edge/Firefox).
- Lokální HTTP server (kvůli ES modulům, `fetch`, Service Workeru a PWA funkcím).

### Spuštění (varianta Python)

```powershell
cd C:\Users\Katya\Desktop\uni\sem
python -m http.server 8080
```

Pak otevřete:

`http://localhost:8080`

### Spuštění (varianta Node.js)

```powershell
cd C:\Users\Katya\Desktop\uni\sem
npx serve .
```

Poznámka: Aplikaci nespouštějte přes `file://`, některé funkce pak nebudou fungovat správně.

## Offline/PWA chování

- Manifest nastavuje aplikaci jako `standalone`.
- Service Worker cacheuje HTML/CSS/JS/assets a při offline navigaci vrací shell.
- Upload nových skladeb je při offline režimu blokován (záměrně, viz validace v `dataHandler.js`).

## Ukládání dat

- Skladby se ukládají do IndexedDB: databáze `skyTuneDB`, objektový store `tracks`.
- Poslední aktivní index skladby se ukládá do `localStorage` pod klíčem `currentTrackIndex`.
- Playlist je po obnovení stránky automaticky obnoven z IndexedDB.
