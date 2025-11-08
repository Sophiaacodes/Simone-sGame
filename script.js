//ELEMENTI BASE DEL GIOCO
const background = document.getElementById("background");
const player = document.getElementById("player");
const coin = document.getElementById("coin");
const pBack  = document.getElementById("parallax-back");
const pFront = document.getElementById("parallax-front");
const world  = document.getElementById("world");
const levelEl = document.getElementById("level");

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

//Contare punti
let cokeCount = 0;

function updateScoreBoard() {
    scoreBoard.textContent= 'Points: ' + cokeCount;
}

function addCoke(n=1) {
    cokeCount += n;
    updateScoreBoard();
}

updateScoreBoard();

//POSIZIONAMENTO ELEMENTI DI GIOCO
const cell = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--tile'));

function addTile({x, y, w=1, h=1, classes="", payload = null}) {
    const tile = document.createElement("div");
    tile.className = `tile ${classes}`;
    tile.style.setProperty("--w", w);
    tile.style.setProperty("--h", h);
    tile.style.left = (x * cell) + "px";
    tile.style.bottom = (y * cell) + "px";
    if (payload) tile.dataset.payload = payload;
    levelEl.appendChild(tile);
    return tile;
}


const legend = {
    ' ': null,
    '€': { classes: "ground normal", w: 2, h: 2, solid: true},
    '$': { classes: "ground angled-left", w: 2, h: 2, solid: true},
    '?': { classes: "ground angled-right", w: 2, h: 2, solid: true},
    '!': { classes: "ground vertical-left", w: 2, h: 2, solid: true},
    '#': { classes: "ground vertical-right", w: 2, h: 2, solid: true},
    'X': { classes: "ground underground", w: 2, h: 2, solid: true},
    'B': { classes: "brick", w: 1, h: 1, solid: true},
    'C': { classes: "full-surprise", w: 1, h: 1,solid: true, payload: "coke"},
    'M': { classes: "full-surprise", w: 1, h: 1,solid: true, payload: "burger"},
};

const level = [
    "                                                                                     ",
    "                                                                                     ",
    "                                                                                     ",
    "        BCBBB                                                                        ",
    "                  BBBB                                                               ",
    "                           BMBBB                                                     ",
    "                                                    $ € € € € € € € € € ?            ",
    "                                                                                     ",
    "                                                    ! X X X X X X X X X #            ",
    "                                                                                     ",
    "$ € € € € € € € € € € € € € € € € € ?     $ € € € € X X X X X X X X X X X € € € € € ?",
    "                                                                                     ",
    "! X X X X X X X X X X X X X X X X X #     ! X X X X X X X X X X X X X X X X X X X X #"
];

function aabbOverlap(ax, ay, aw, ah, bx, by, bw, bh) {
    return ax < bx + bw &&
           ay < by + bh &&
           bx < ax + aw &&
           by < ay + ah;
}

let solid = [];

function buildLevel (rows, legend) 
    { solid = [];
        const H = rows.length; for (let r=0; r<H; r++) { 
        const line = rows [H - 1 - r]; 
        let xc = 0; while (xc < line.length) { 
            const ch = line[xc]; 
            const entry = legend[ch]; 
            if (!entry) { xc++; continue; } 

            const { classes = "", w = 1, h = 1, solid: isSolid = false, payload = null } = entry; 
            const el = addTile({ x: xc, y: r, w, h, classes, payload });


            if (isSolid) {
                solid.push ({
                    x: xc * cell,
                    y: r * cell,
                    w: w * cell,
                    h: h * cell,
                    el,
                })
            }
            xc += w; 
        } 
    } 
};
buildLevel(level, legend);

const levelWidth = solid.reduce((max, s) => Math.max(max, s.x + s.w), 0);

//console.log(solid);

/*
function checkCollision() {
    const playerRect = player.getBoundingClientRect();
    const tiles = document.querySelectorAll(".tile");
    for (const tile of tiles) {
        const tileRect = tile.getBoundingClientRect();
        if (aabbOverlap(
            playerRect.left, playerRect.top, playerRect.width, playerRect.height,
            tileRect.left, tileRect.top, tileRect.width, tileRect.height))
        return true;

    }};

checkCollision();
console.log(checkCollision());*/

//MOVIMENTO DEL PERSONAGGIO FISICA
let x=200;
let y=130;
let vx=0, vy=0;
let onGround = false;

const moveSpeed = 220;
const jumpSpeed = 420;
const gravity = 650;
const maxFallSpeed = 900;
const enemySpeed = 300;

const playerdimensions = (() => {
    const rect = player.getBoundingClientRect();
    return { w: rect.width, h: rect.height };
})();
//console.log(playerdimensions);

//PERSONAGGIO CONTROLLI
const keys = { left: false, right: false, up: false };

function applyPosition () {
    const screenX = x - camX;
    player.style.left = screenX + "px";
    player.style.bottom = y + "px";
};

//animazioni personaggio
function updateAnimation() {
    const skin = paolinoActive ? 'paolino' : 'player';
    const other = paolinoActive ? 'player' : 'paolino';

    const isRunning = (keys.left || keys.right) && onGround;
    const isAirUp = !onGround && vy > 0;
    const isAirDown =!onGround && vy < 0;

    player.classList.remove('idle','player-run','player-jump','player-fall','paolino-idle','paolino-run','paolino-jump','paolino-fall');

    if (skin === 'player') {
        if (!isRunning && !isAirUp && !isAirDown) player.classList.add('idle');
        if (isRunning)  player.classList.add('player-run');
        if (isAirUp)    player.classList.add('player-jump');
        if (isAirDown)  player.classList.add('player-fall');
    } else { 
        if (!isRunning && !isAirUp && !isAirDown) player.classList.add('paolino-idle');
        if (isRunning)  player.classList.add('paolino-run');
        if (isAirUp)    player.classList.add('paolino-jump');
        if (isAirDown)  player.classList.add('paolino-fall');
    }


    if (keys.left && !keys.right)  player.style.transform = "scaleX(-1)";
  else                           player.style.transform = null;
};

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight"){keys.right = true; updateAnimation();}
    if (event.key === "ArrowLeft"){keys.left = true; updateAnimation();}
    if (event.key === "ArrowUp") {
        if (onGround){
            keys.up = true; 
            vy = jumpSpeed;
            onGround = false;
        }; updateAnimation();} 
});

document.addEventListener("keyup", (e) => {
    if (e.key === "ArrowRight"){keys.right = false; updateAnimation();}
    if (e.key === "ArrowLeft"){keys.left = false; updateAnimation();}
    if (e.key === "ArrowUp") {keys.up = false; updateAnimation();}
});

//console.log({x,y,vx,vy,onGround})

//collisioni mondo e movimento
function moveAndCollideX(dx){
    let newX = x + dx;
    for (const s of solid) {
        if (aabbOverlap(
            newX, y, playerdimensions.w, playerdimensions.h, s.x, s.y, s.w, s.h)) {
                if (dx > 0) { newX = s.x - playerdimensions.w; }
                else if (dx < 0) { newX = s.x + s.w; }
                vx = 0;
                }
    }
    x = newX;
}

//full to empty surprise
function moveAndCollideY(dy){
    let newY = y + dy;
    onGround = false;
    let hitCeilTile = null;

    for (const s of solid) {
        if (aabbOverlap(
            x, newY, playerdimensions.w, playerdimensions.h, s.x, s.y, s.w, s.h)) {
                if (dy > 0) {
                     newY = s.y - playerdimensions.h; 
                     vy=0;
                     hitCeilTile = s;
                    }
                else if (dy < 0) { 
                    newY = s.y + s.h; 
                    vy=0;
                    onGround = true; 
                }
                
        }
    }
    y = newY;

    if(hitCeilTile && hitCeilTile.el && hitCeilTile.el.classList.contains('full-surprise')) {
        const payload = hitCeilTile.el.dataset.payload || 'coke';

        hitCeilTile.el.classList.remove('full-surprise');
        hitCeilTile.el.classList.add('empty-surprise');

        if (payload === 'coke'){
            spawnCokeAbove(hitCeilTile);
        } else if (payload === 'burger'){
            spawnBurgerAbove(hitCeilTile);
        }
    }
}

//comportamento aabb con burger o coke
const items = [];

function updateItems(dt){
    for (const it of items) {
        if (!it.alive) continue;

    
    it.el.style.left = it.x + 'px';
    it.el.style.bottom = it.y + 'px';
    
    if (aabbOverlap(x, y, playerdimensions.w, playerdimensions.h, it.x, it.y, it.w, it.h)) {
        if (it.type === 'coke') {
            addCoke(1);
        } else if (it.type === 'burger'){
            activatePaolinoPower(30000)
        }
        it.alive = false;
        it.el.remove();
    }
    }
}

//azioni di spawn coke e burger
function spawnCokeAbove(s, {offsetX = 0, offsetY = 0} = {}) {
    const el = document.createElement('div');
    el.className = 'ui ui-coke';
    el.style.setProperty('--w', '32px');
    el.style.setProperty('--h', '32px');
    const w = 32, h = 32;
    const x = s.x + s.w / 2  - w / 2 + offsetX;
    const y = s.y + s.h + offsetY;

    el.style.left = x + 'px';
    el.style.bottom = y + 'px';
    levelEl.appendChild(el);

    items.push({el, type:'coke', x,y,w,h, vx:0, vy:0, alive:true, pickup:true});

    el.animate([
        { transform:'translateY(0px)' },
        { transform:'translateY(12px)' },
        { transform:'translateY(0px)' }
        ], { duration: 250, easing:'ease-out' });
};

function spawnBurgerAbove(s, {offsetX = 0, offsetY = 0} = {}) {
    const el = document.createElement('div');
    el.className = 'ui ui-burger';
    el.style.setProperty('--w', '28px'); 
    el.style.setProperty('--h', '28px');
    const w = 28, h = 28;
    const x = s.x + s.w / 2  - w / 2 + offsetX;
    const y = s.y + s.h + offsetY;

    el.style.left = x + 'px';
    el.style.bottom = y + 'px';
    levelEl.appendChild(el);

    el.animate([
        { transform:'translateY(0px)' },
        { transform:'translateY(12px)' },
        { transform:'translateY(0px)' }
        ], { duration: 250, easing:'ease-out' });

    items.push({el, type:'burger', x,y,w,h, vx:60, vy:120, alive:true, pickup:true});
}

//paolino player
player.classList.add('player')

let paolinoActive = false;
let paolinoTimeoutId = null;

function activatePaolinoPower(ms = 30000) {
    paolinoActive=true;
    if (paolinoTimeoutId) clearTimeout(paolinoTimeoutId);
    paolinoTimeoutId= setTimeout(() => {
        paolinoActive=false;
        updateAnimation();
    }, ms);
    updateAnimation();
};


//Camera
let camX = 0;

function clampCam() {
    const viewportWidth = background.getBoundingClientRect().width;
    const maxCamX = Math.max(0, levelWidth - viewportWidth);
    if (camX < 0 ) camX = 0;
    if (camX > maxCamX) camX = maxCamX;
}

//prallax
function updateParallax() {
    background.style.backgroundPositionX = -(camX * 0.2) + "px";
    pBack.style.backgroundPositionX = -(camX * 0.4) + "px";
    pFront.style.backgroundPositionX = -(camX * 0.6) + "px";
}

// --- GAME LOOP ---
let lastTime = null;
function loop(t) {
  if (lastTime == null) lastTime = t;
  const dt = Math.min((t - lastTime) / 1000, 0.033); // in secondi, clamp a ~30fps max step
  lastTime = t;

  // Input → velocità orizzontale
  const dir = (keys.right ? 1 : 0) + (keys.left ? -1 : 0);
  vx = dir * moveSpeed;

  // Gravità e velocità verticale
  vy -= gravity * dt;
  if (vy < -maxFallSpeed) vy = -maxFallSpeed;

  // Integrazione + collisioni
  moveAndCollideX(vx * dt);
  moveAndCollideY(vy * dt);

  updateItems(dt);

  // Aggiornamento camera
  const viewportWidth = background.getBoundingClientRect().width;
  camX = x - viewportWidth / 2 + playerdimensions.w / 2;
  
  clampCam();

  world.style.setProperty('--camX', camX + 'px');

  // Limiti e rendering
  applyPosition();
  updateParallax();
  updateAnimation();

  requestAnimationFrame(loop);
}

// Posizione iniziale visiva e avvio
applyPosition();
requestAnimationFrame(loop);


