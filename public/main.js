const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
let w = canvas.offsetWidth;
let h = canvas.offsetHeight;
canvas.width = w;
canvas.height = h;
const stars = [];
const rings = [0, Math.PI / 4, Math.PI / 2];
const c1 = document.querySelector("#c1");
const c2 = document.querySelector("#c2");
const c3 = document.querySelector("#c3");

function init() {
    stars.splice(0);
    const n = Math.max(500, Math.floor(0.7 * w));
    for (let i = 0; i < n; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        const r = Math.random() * 2;
        const a = Math.random() * 0.5 + 0.5;
        stars.push({ x, y, r, a });
    }
}

const observer = new ResizeObserver(() => {
    w = canvas.offsetWidth;
    h = canvas.offsetHeight;
    canvas.width = w;
    canvas.height = h;
    init();
});

const opacity = (x) => {
    x = x / Math.PI;
    if (x > 0.75) return 1 - x * x;
    return 1 - x * x * x;
};

function render() {
    ctx.clearRect(0, 0, w, h);
    stars.forEach((star) => {
        const { a, x, y, r } = star;
        ctx.save();
        ctx.fillStyle = `rgba(255,255,255,${a})`;
        ctx.strokeStyle = `rgba(255,255,255,${a})`;
        ctx.beginPath();
        ctx.fillRect(x, y, r, r);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    });

    c1.setAttribute(
        "style",
        `transform: translateX(-50%) translateY(-50%) scale(${rings[0] / Math.PI}) translateZ(0px); opacity: ${opacity(rings[0])}`,
    );
    c2.setAttribute(
        "style",
        `transform: translateX(-50%) translateY(-50%) scale(${rings[1] / Math.PI}) translateZ(0px); opacity: ${opacity(rings[1])}`,
    );
    c3.setAttribute(
        "style",
        `transform: translateX(-50%) translateY(-50%) scale(${rings[2] / Math.PI}) translateZ(0px); opacity: ${opacity(rings[2])}`,
    );
}

const limit = (x, min, max) => {
    x = Math.min(max, Math.max(min, x));
    return x == max ? 0 : x;
};

function update() {
    stars.forEach((star) => {
        star.x += star.a * 0.25;
        if (star.x >= w) {
            star.x = -10;
        }
    });
    rings[0] = limit(rings[0] + 0.03 / Math.PI, 0, Math.PI);
    rings[1] = limit(rings[1] + 0.03 / Math.PI, 0, Math.PI);
    rings[2] = limit(rings[2] + 0.03 / Math.PI, 0, Math.PI);
}

let handle;
let end = false;
function drawFrame() {
    if (end) return;
    update();
    render();
    handle = requestAnimationFrame(drawFrame);
}
window.onbeforeunload = () => {
    end = true;
    cancelAnimationFrame(handle);
    observer.disconnect();
};
document.addEventListener("DOMContentLoaded", () => {
    init();
    drawFrame();
    observer.observe(canvas);
});
