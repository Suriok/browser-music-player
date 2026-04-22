import { popup } from "./popup.js";
import { dataHandler } from "./dataHandler.js";
import { player } from "./player.js";
import { playlistSearch } from "./search.js";
import { cloudsSetup } from "./cloude.js";

function registerServiceWorker() {
    if (!("serviceWorker" in navigator)) return;

    window.addEventListener("load", async () => {
        try {
            await navigator.serviceWorker.register("./sw.js");
        } catch (error) {
            console.error("Service worker registration failed:", error);
        }
    });
}

async function initApp() {
    popup.setup();
    await dataHandler.setup();
    player.setup();
    playlistSearch.setup();
    await cloudsSetup();
}

registerServiceWorker();
initApp();
