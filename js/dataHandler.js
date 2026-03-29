// OPEN COMPUTER FILES
const browseButton = document.querySelector(".browse_button")
const audioFileInput = document.getElementById("audioFileInput")
const dropZone = document.getElementById("drop_zone")

// BROWSE FILES
browseButton.addEventListener("click", () => {
    audioFileInput.click();
});

audioFileInput.addEventListener("change", (event) => {
    const files = Array.from(event.target.files);
    handleFiles(files);
});

// DROP FILES
dropZone.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropZone.classList.add("dragover");
});

dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("dragover");
});

dropZone.addEventListener("drop", (event) => {
    event.preventDefault();
    dropZone.classList.remove("dragover");

    const files = Array.from(event.dataTransfer.files);
    handleFiles(files);
})

//  MAIN FUNCTION TO HANDLE FILES
function handleFiles(files) {
    const maxSize = 50 * 1024 * 1024;
    const allowedTypes = ["audio/mpeg", "audio/wav", "audio/x-wav"];

    files.forEach((file) => {
        if (!allowedTypes.includes(file.type)) {
            alert(`File "${file.name}" is not MP3 or WAV.`);
            return;
        }

        if (file.size > maxSize) {
            alert(`File "${file.name}" is larger than 50MB.`);
            return;
        }

        console.log("Valid file:", file.name);
        console.log("Type:", file.type);
        console.log("Size:", file.size);

        const fileURL = URL.createObjectURL(file);
        console.log("Temporary URL:", fileURL);
    });
}