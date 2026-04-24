const SVG_PATHS = [
    "photo/cloud_1.svg",
    "photo/cloud_2.svg",
    "photo/cloud_3.svg"
];

const totalClouds = 25;
const minSpeed = 0.2;
const maxSpeed = 1;
const laneCount = 5;
const spawnPadding = 220;
const exitPadding = 40;

let cloudData = [];

async function loadSVGTemplates() {
    const wrapper = document.querySelector("main");
    return await Promise.all(
        SVG_PATHS.map(async (path) => {
            const response = await fetch(path);
            const text = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, "image/svg+xml");
            const svgEl = doc.documentElement;
            svgEl.style.display = "none";
            wrapper.appendChild(svgEl);
            return svgEl;
        })
    );
}

function createClouds(templates) {
    const wrapper = document.querySelector("main");
    const wrapperHeight = window.innerHeight;
    const laneHeight = wrapperHeight / laneCount;

    for (let i = 0; i < totalClouds; i++) {
        const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
        const cloudClone = randomTemplate.cloneNode(true);
        cloudClone.classList.add("cloud");
        cloudClone.style.display = "";
        cloudClone.style.position = "absolute";
        cloudClone.style.left = "0";
        cloudClone.style.pointerEvents = "none";
        wrapper.appendChild(cloudClone);

        const speed = Math.random() * (maxSpeed - minSpeed) + minSpeed;
        const scale = 1 + Math.random();
        const width = 250 * scale;
        const laneIndex = i % laneCount;
        const topPosition = laneIndex * laneHeight + Math.random() * (laneHeight / 3);
        const startX = Math.random() * (window.innerWidth + 800);

        cloudData.push({ el: cloudClone, x: startX, speed, width });

        cloudClone.style.top = `${topPosition}px`;
        cloudClone.style.width = `${width}px`;
        cloudClone.style.height = "auto";
        cloudClone.style.opacity = 0.4 + Math.random() * 0.5;
    }
}

function animate() {
    cloudData.forEach(cloud => {
        cloud.x -= cloud.speed;
        const rightEdge = cloud.x + cloud.width;
        if (rightEdge < -exitPadding) {
            cloud.x = window.innerWidth + spawnPadding;
            cloud.speed = Math.random() * (maxSpeed - minSpeed) + minSpeed;
        }

        cloud.el.style.transform = `translate3d(${cloud.x}px, 0, 0)`;
    });
    requestAnimationFrame(animate);
}

export async function cloudsSetup() {
    const templates = await loadSVGTemplates();
    createClouds(templates);
    animate();
}
