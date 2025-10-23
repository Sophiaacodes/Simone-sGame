console.log("JavaScript is connected");

const world = document.getElementById("background")

const player = document.getElementById("player");
let x = 0;
const step = 10;

document.addEventListener("keydown", (event) => {
    //console.log("hai premuto", event.key);

    if (event.key === "ArrowRight"){
        x+= step;
        render();
    }
    if (event.key === "ArrowLeft"){
        x-=step;
        render();
    }
    if (event.key === "ArrowUp"){
        player.style.bottom = "150px";
        setTimeout(() => {
            player.style.bottom = "60px"
        }, 300);
    }
});

function clampToWorld() {
    const worldRect = world.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();
    const minX = 0;
    const maxX = worldRect.width - playerRect.width;

    if (x < minX) x = minX;
    if (x > maxX) x = maxX;
}

function render() {
    clampToWorld();
    player.style.left = x + "px";
}
