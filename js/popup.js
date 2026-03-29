// POP UP
const popUpOpen = document.getElementById("open");
const popUpClose = document.getElementById("close");
const popup = document.getElementById("popUp");

popUpOpen.addEventListener("click", () => {
    popup.classList.remove("hidden");
});

popUpClose.addEventListener("click", () => {
    popup.classList.add("hidden");
});

popup.addEventListener("click", (event) => {
    if (event.target === popup) {
        popup.classList.add("hidden");
    }
});


