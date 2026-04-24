// POP UP
class Popup {
    constructor() {
        this.popupElement = document.getElementById("popUp");
        this.openButton = document.getElementById("open");
        this.closeButton = document.getElementById("close");
    }

    // Show popup dialog.
    open() {
        this.popupElement.classList.remove("hidden");
    }

    // Hide popup dialog.
    close() {
        this.popupElement.classList.add("hidden");
    }

    // Bind open/close interactions.
    setup() {
        if (this.openButton) {
            this.openButton.addEventListener("click", () => this.open());
        }

        if (this.closeButton) {
            this.closeButton.addEventListener("click", () => this.close());
        }

        if (this.popupElement) {
            this.popupElement.addEventListener("click", (event) => {
                if (event.target === this.popupElement) {
                    this.close();
                }
            });
        }
    }
}

export const popup = new Popup();
