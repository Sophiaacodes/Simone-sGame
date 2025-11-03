//ELEMENTI BASE DEL GIOCO
const background = document.getElementById("background");
const player = document.getElementById("player");
const coin = document.getElementById("coin");
const pBack  = document.getElementById("parallax-back");
const pFront = document.getElementById("parallax-front");
const world  = document.getElementById("world");

//scoreboard
const scoreBoard = document.createElement("div");
scoreBoard.id = "scoreBoard";
world.appendChild(scoreBoard);

//SCOMPARSA DELLA SCHERMATA INIZIALE
let overlayRemoved = false;
document.addEventListener("keydown", (e) => {

    if ([" ", "ArrowRight", "ArrowLeft", "ArrowUp"].includes(e.key))  { 
        if (!overlayRemoved) {
        e.preventDefault();
            document.getElementById("keyframe")?.remove();
            scoreBoard.style.display = "block";
            overlayRemoved = true;
}}});

//POSIZIONAMENTO ELEMENTI DI GIOCO
const cell = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--tile'));

function addTile({x, y, w=1, h=1, classes=""}) {
    const tile = document.createElement("div");
    tile.className = `tile ${classes}`;
    tile.style.setProperty("--w", w);
    tile.style.setProperty("--h", h);
    tile.style.left = (x * cell) + "px";
    tile.style.bottom = (y * cell) + "px";
    world.appendChild(tile);
    return tile;
}


const legend = {
    ' ': null,
    '€': { classes: "ground normal", w: 2, h: 2},
    '$': { classes: "ground angled-left", w: 2, h: 2},
    '?': { classes: "ground angled-right", w: 2, h: 2},
    '!': { classes: "ground vertical-left", w: 2, h: 2},
    '#': { classes: "ground vertical-right", w: 2, h: 2},
    'X': { classes: "ground underground", w: 2, h: 2},
    'B': { classes: "brick", w: 1, h: 1},
    'S': { classes: "full-surprise", w: 1, h: 1},
};

const level = [
    "                                                                                    ",
    "                                                                                    ",
    "                                                                                    ",
    "        BSBBB                                                                       ",
    "                  BBBB                  $€€€€€€€€€?                                 ",
    "                           BSBBB        #XXXXXXXXX!                                 ",
    "                                                                                    ",
    "                                                                                    ",
    "$ € € € € € € € € € € € € € € € € € ?    $€€€€€€€€€€€XXXXXXXXX€€€€€€€€€€€€€€€€€€€€€?",
    "! X X X X X X X X X X X X X X X X X #     !XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX#"
];

function buildLevel (rows, legend) 
    { const H = rows.length; for (let r=0; r<H; r++) { 
        const line = rows [H - 1 - r]; 
        let x = 0; while (x < line.length) { 
            const ch = line[x]; 
            const entry = legend[ch]; 
            if (!entry) { x++; continue; } 
            const {classes="", w=1, h=1} = entry; 
            
            addTile({x, y: r, w, h, classes}); 
            x += w; 
        } 
    } 
};
buildLevel(level, legend);


//MOVIMENTO DEL PERSONAGGIO

let x = 250;
let score = 0;
const step = 10;

//player run
const keys = { left: false, right: false };

function updateAnimation() {
    const isRunning = keys.left || keys.right;
    player.classList.toggle("player-run", isRunning);
    player.classList.toggle("idle", !isRunning);
    
  if (keys.left && !keys.right)  player.style.transform = "translateX(-50%) scaleX(-1)";
  if (keys.right && !keys.left)  player.style.transform = "translateX(-50%)";
}

//camminare e saltare
document.addEventListener("keydown", (event) => {

    if (event.key === "ArrowRight"){
        x+= step;
        keys.right = true;
        updateAnimation();
        render();
    }
    if (event.key === "ArrowLeft"){
        x-=step;
        keys.left = true;
        updateAnimation();
        render();
    }
    if (event.key === "ArrowUp"){
        player.style.bottom = "167px";
        setTimeout(() => {
            player.style.bottom = "97px"
        }, 300);
    }
});

document.addEventListener("keyup", (event) => {
    if (event.key === "ArrowRight"){keys.right = false; updateAnimation();}
    if (event.key === "ArrowLeft"){keys.left = false; updateAnimation();}
});

// LIMITI DEL MONDO
function clampToWorld() {
  const worldRect  = background.getBoundingClientRect();
  const playerRect = player.getBoundingClientRect();
  const minX = 0;
  const maxX = worldRect.width - playerRect.width;
  if (x < minX) x = minX;
  if (x > maxX) x = maxX;
}

//interazione moneta
//punteggio
function updateScore() {
    scoreBoard.textContent = "Punteggio: " + score;
};

//collisione con la moneta
function checkCollision() {
    const playerRect = player.getBoundingClientRect();
    const coinRect = coin.getBoundingClientRect();

    const overlap =
        playerRect.left < coinRect.right &&
        playerRect.right > coinRect.left &&
        playerRect.top < coinRect.bottom &&
        playerRect.bottom > coinRect.top;

  return overlap;

}
function collectcoin() {
    coin.style.opacity = "0";
    score ++;
    updateScore ();

    setTimeout(() => {
        movecoin();
        coin.style.opacity = "1";
    }, 1000);
}
updateScore ();

function render() {
    clampToWorld();
    player.style.left = x + "px";
    if (checkCollision()) {
        collectcoin();
    }
}



