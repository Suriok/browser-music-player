import { popup } from "./popup.js";
import { dataHandler } from "./dataHandler.js";
import { player } from "./player.js";
import { playlistSearch } from "./search.js";

async function initApp() {
    popup.setup();
    await dataHandler.setup();
    player.setup();
    playlistSearch.setup();
}

initApp();