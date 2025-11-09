//ELEMENTI BASE DEL GIOCO
const background = document.getElementById("background");
const player = document.getElementById("player");
const coin = document.getElementById("coin");
const pBack  = document.getElementById("parallax-back");
const pFront = document.getElementById("parallax-front");
const world  = document.getElementById("world");
const levelEl = document.getElementById("level");
const lostPanel = document.getElementById("lostgame");
const winPanel  = document.getElementById("wongame");
const pointsLoseEl = document.getElementById("points"); 
const pointsWinEl  = document.getElementById("point");  

//scoreboard
const scoreBoard = document.createElement("div");
scoreBoard.id = "scoreBoard";
world.appendChild(scoreBoard);

//SCOMPARSA DELLA SCHERMATA INIZIALE
let gameStarted = false;
let overlayRemoved = false;
document.addEventListener("keydown", (e) => {

    if ([" ", "ArrowRight", "ArrowLeft", "ArrowUp"].includes(e.key))  { 
        if (!overlayRemoved) {
        e.preventDefault();
            document.getElementById("keyframe")?.remove();
            scoreBoard.style.display = "block";
            overlayRemoved = true;
            gameStarted = true;
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
    'S': { classes: "", w: 1, h: 1, solid: false, enemyType: 'spider' },
};

const level = [
    "                                                                                                                      M                                                                                                                                                           C                        ",
    "                                                     C  C  C  C                                                                                                                                                                                                                                           ",
    "                                                                                                                                                                                                                                                                                                          ",
    "        BCBBB                                                      S   S                                  S                                                                                                                                                                                               ",
    "                  BBBB                                                                                      $ € € € € ?                                                                                                        M                                                 B                        ",
    "                           BMBBB                                                                                                                                       BBBBB                                                         S                                        B  B                        ",
    "                                                    $ € € € € € € € € € ?                             $ € € X X X X X #       BCBCBCBCBCB              BCBCCCBCB                     BBBCCC                                                             CCC                B  B  B                        ",
    "                                   S                                                                                                 S     S                                                             S                                       S                      B  B  B  B                        ",
    "                                                    ! X X X X X X X X X #                       $ € € X X X X X X X X #                                                                                                   $ € € € € € ?                              B  B  B  B  B                        ",
    "                                                                                                                                                                                                                                                                                                          ",
    "$ € € € € € € € € € € € € € € € € € ?     $ € € € € X X X X X X X X X X X € € € € € ?       $ € € X X X X X X X X X X € € € € € € € € € € € € ?       $ € € € € € € € € ?                $ € € € € € € € € ?        $ € € X X X X X X #      $ € € € € € € € € € € € € € € € € € € € € € € € € € € € € € ?",
    "                                                                                                                                                                                                                                                                                                          ",
    "! X X X X X X X X X X X X X X X X X #     ! X X X X X X X X X X X X X X X X X X X X #       ! X X X X X X X X X X X X X X X X X X X X X X X X #       ! X X X X X X X X #                ! X X X X X X X X #        ! X X X X X X X X #      ! X X X X X X X X X X X X X X X X X X X X X X X X X X X X X #"
];

function aabbOverlap(ax, ay, aw, ah, bx, by, bw, bh) {
    return ax < bx + bw &&
           ay < by + bh &&
           bx < ax + aw &&
           by < ay + ah;
}

//enemies
const spider_w = 64;
const spider_h = 64;
const enemies = [];

function makeSpider(xpx, xpy){
    const el = document.createElement('div');
    el.className = 'enemy spider walk';
    el.style.left = xpx + 'px';
    el.style.bottom = xpy + 'px';
    levelEl.appendChild(el);
 
    enemies.push({
        type : 'spider',
        el, x : xpx, y : xpy, w: spider_w, h : spider_h,
        vx: 80, vy:0, dir: -1,
        alive: true, onGround: false
    })
}

let solid = [];

function buildLevel (rows, legend) 
    { solid = [];
      enemies.length=0;

        const H = rows.length; for (let r=0; r<H; r++) { 
        const line = rows [H - 1 - r]; 
        let xc = 0; while (xc < line.length) { 
            const ch = line[xc]; 
            const entry = legend[ch]; 
            if (!entry) { xc++; continue; } 

            const { classes = "", w = 1, h = 1, solid: isSolid = false, payload = null, enemyType = null} = entry; 

            if (!enemyType) {
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
         } else if (enemyType === 'spider') {
                const xpx = xc * cell + (cell - spider_w) / 2;
                const xpy = r * cell + (cell - spider_h);
                makeSpider (xpx, xpy);
            }
            xc += w; 
        } 
    } 
};
buildLevel(level, legend);

const levelWidth = solid.reduce((max, s) => Math.max(max, s.x + s.w), 0);

//console.log(solid);


//MOVIMENTO DEL PERSONAGGIO FISICA
let x=200;
let y=130;
let vx=0, vy=0;
let onGround = false;

const moveSpeed = 220;
const jumpSpeed = 420;
const gravity = 650;
const maxFallSpeed = 900;

const run_ref_speed = 220;
const run_ref_dur = 0.60;
const run_min_dur = 0.18;
const run_max_dur = 0.60;

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
    if (isAttacking) return; 

    const skin = paolinoActive ? 'paolino' : 'player';
    const other = paolinoActive ? 'player' : 'paolino';

    const isRunning = (Math.abs(vx)>1) && onGround;
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

let facing = 1;
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight"){keys.right = true; facing=1; updateAnimation();}
    if (event.key === "ArrowLeft"){keys.left = true; facing= -1; updateAnimation();}
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

//movimento nemici
function willFallAhead(e) {
  const look = 6;
  const footX = e.x + (e.dir > 0 ? e.w + look : -look);
  const footY = e.y - 2;
  const probeW = 2, probeH = 2;

  for (const s of solid) {
    if (aabbOverlap(footX, footY, probeW, probeH, s.x, s.y, s.w, s.h)) {
      return false;
    }
  }
  return true; 
}

function moveSpider(e, dt){
  // --- ORIZZONTALE ---
  if (gameStarted) {
    let newX = e.x + e.vx * e.dir * dt;
    let hitWall = false;

    for (const s of solid) {
      if (aabbOverlap(newX, e.y, e.w, e.h, s.x, s.y, s.w, s.h)) {
        hitWall = true;
        break;
      }
    }
    if (hitWall) {
     e.dir *= -1; 
     } else {
     e.x = newX;
    }

    if (e.onGround && willFallAhead(e)) {
      e.dir *= -1;
    }}

  // --- VERTICALE (gravità) ---
  e.vy -= gravity * dt;
  if (e.vy < -maxFallSpeed) e.vy = -maxFallSpeed;

  let newY = e.y + e.vy * dt;
  e.onGround = false;

  for (const s of solid) {
    if (aabbOverlap(e.x, newY, e.w, e.h, s.x, s.y, s.w, s.h)) {
      if (e.vy < 0) { 
        newY = s.y + s.h;
        e.vy = 0;
        e.onGround = true;
      } else if (e.vy > 0) { 
        newY = s.y - e.h;
        e.vy = 0;
      }
    }
  }
  e.y = newY;


  e.el.style.left = e.x + 'px';
  e.el.style.bottom = e.y + 'px';
  e.el.style.transform = e.dir < 0 ? 'scaleX(-1)' : 'scaleX(1)';
}

//uccisione dei nemici
function killSpider(e) {
    if (!e.alive) return;
    e.alive = false;

    e.el.classList.remove('walk');
    e.el.style.animation = 'none';

    e.el.animate(
        [{ transform: 'scaleY(1)', opacity: 1 }, { transform: 'scaleY(0.5)', opacity: 0 }],
    { duration: 200, easing: 'ease-out', fill: 'forwards' }
  );
  setTimeout(() => e.el.remove(), 220);
}

function handlePlayerEnemyInteractions() {
    const stomp_eps = 6;
    for (const e of enemies) {
        if (!e.alive) continue;
        if (!aabbOverlap(x, y, playerdimensions.w, playerdimensions.h, e.x, e.y, e.w,e.h)) continue;

        const playerBottom = y;
        const playerIsMovingDown = vy < 0;

        if (playerIsMovingDown && playerBottom >= e.y + e.h - stomp_eps){
            killSpider(e);
            vy = jumpSpeed * 0.55;
            continue;
        }
        showLose("hit-spider");
        return;
    }
}

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

//paolino vs enemy
const attack_range_tile = 6; 
let isAttacking = false; 

document.addEventListener("keydown", (event) =>{
    if ((event.key === 's' || event.key === 'S') && paolinoActive && !isAttacking) {
    const target = findSpiderInRange(attack_range_tile * cell); // 2 tile = 64px
    if (target) {
      doPaolinoAttack(target);
    }
  }
});

function findSpiderInRange(
    rangePx=attack_range_tile*cell,
    ) {
    const pxCenter = x + playerdimensions.w /2;
    let best = null, bestDist = Infinity;

    for (const e of enemies) {
        if (!e.alive) continue;
        const exCenter = e.x + e.w /2;
        const dx = Math.abs(exCenter -pxCenter);
        const verticallyClose = Math.abs((y + playerdimensions.h/2) - (e.y + e.h/2)) <= cell*2;
        if (dx <= rangePx && verticallyClose && dx < bestDist) {
            best = e; bestDist = dx; }      
    }
    return best;
};

function doPaolinoAttack(target){
    isAttacking = true;
    
    player.style.transform = (keys.left && !keys.right) ? 'scaleX(-1)' : null;
    player.classList.remove('paolino-attack');
    void player.offsetWidth; 

    player.classList.remove('idle','player-run','player-jump','player-fall','paolino-idle','paolino-run','paolino-jump','paolino-fall');
    player.classList.add('paolino-attack')

    const attack_ms = 600;
    const oldVx = vx;
    vx = 0;

    setTimeout(()=>{
        if (target.alive) killSpider(target);

        player.classList.remove('paolino-attack');
        vx = oldVx;

        updateAnimation();

        isAttacking = false;
    }, attack_ms);
};

//stato di gioco (punto di arrivo, reset gioco)
let gameOver = false;
let youWin = false;

const finishX = Math.max(0, levelWidth - 2*cell);

function showLose(reason = ""){
    if (gameOver) return;
    gameOver = true;
    youWin = false;

    vx=0; vy=0;
    pointsLoseEl.textContent = `Points: ${cokeCount}`;
    lostPanel.style.display = "block";
}

function showWin(reason = "") {
  if (gameOver) return;
  gameOver = true;
  youWin = true;

  vx = 0; vy = 0;
  pointsWinEl.textContent = `Points: ${cokeCount}`;
  winPanel.style.display = "block";
}

function resetGame() {
    lostPanel.style.display = "none";
    winPanel.style.display ="none";

    gameOver = false;
    youWin = false;
    gameStarted = true;
    overlayRemoved = true;

    //reset cokecount
    cokeCount = 0;
    updateScoreBoard();

    // reset posizione player
    x = 200; y = 130; vx = 0; vy = 0; camX = 0; onGround = false;

    // ricostruisci livello e nemici
    levelEl.innerHTML = "";
    buildLevel(level, legend);

    // ripristina animazioni player
    isAttacking = false;
    player.className = "player idle";

    applyPosition();
};

//space per riniziare
document.addEventListener("keydown", (e) => {
  // se il gioco è finito, SPACE fa ripartire
  if (gameOver && e.key === " ") {
    e.preventDefault();
    resetGame();
  }
});

//

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
  background.style.backgroundPositionX = snap(-(camX * 0.12)) + "px";
  pBack.style.backgroundPositionX      = snap(-(camX * 0.25)) + "px";
  pFront.style.backgroundPositionX     = snap(-(camX * 0.45)) + "px";
}



//sincronizzazione passi personaggio a controlli
let lastRunDur = null;
function setRunDur(dur) {
  if (lastRunDur === null || Math.abs(dur - lastRunDur) > 0.04) {
    player.style.setProperty('--run-dur', `${dur}s`);
    lastRunDur = dur;
        }
}

function resetRunDur() {
  if (lastRunDur !== run_ref_dur) {
    player.style.setProperty('--run-dur', `${run_ref_dur}s`);
    lastRunDur = run_ref_dur;
        }
}

const speed = Math.abs(vx);
if (onGround && speed > 1) {
      let dur = (run_ref_speed / speed) * run_ref_dur;
      if (dur < run_min_dur) dur = run_min_dur;
      if (dur > run_max_dur) dur = run_max_dur;
      setRunDur(dur);
    } else {
        resetRunDur();
}

// --- viewport cache ---
let viewportWidth  = background.clientWidth  | 0;
let viewportHeight = background.clientHeight | 0;

function updateViewport(){
  viewportWidth  = background.clientWidth  | 0;
  viewportHeight = background.clientHeight | 0;
}

window.addEventListener('resize', () => {
  updateViewport();
  layoutParallax();
});

// --- snap per evitare righe bianche ---
function snap(x){ return (x + 0.5) | 0; }

// --- parallax ancorato alle tile ---
function layoutParallax(){
  const hillsFromGround = 1 * cell;
  const cloudsFromTop   = 1 * cell;

  const hillsH  = Math.round(viewportHeight * 0.30); 
  const cloudsH = Math.round(viewportHeight * 0.30); 

  pBack.style.backgroundSize  = `auto ${hillsH}px`;
  pBack.style.backgroundPosition = `left calc(100% - ${hillsFromGround}px)`;

  pFront.style.backgroundSize = `auto ${cloudsH}px`;
  pFront.style.backgroundPosition = `left ${cloudsFromTop}px`;

  background.style.backgroundSize = `auto ${viewportHeight}px`;
  background.style.backgroundPosition = `left bottom`;
}

function updateParallax() {
  background.style.backgroundPositionX = snap(-(camX * 0.12)) + "px";
  pBack.style.backgroundPositionX      = snap(-(camX * 0.25)) + "px";
  pFront.style.backgroundPositionX     = snap(-(camX * 0.45)) + "px";
}

// --- GAME LOOP ---
let lastTime = null;
function loop(t) {
  if (lastTime == null) lastTime = t;
  const dt = Math.min((t - lastTime) / 1000, 1/60);
  lastTime = t;

  //gameover
  if (gameOver) {
  applyPosition();
  updateParallax();
  requestAnimationFrame(loop);
  return;
  }

  // Input → velocità orizzontale
  const dir = (keys.right ? 1 : 0) + (keys.left ? -1 : 0);
  vx = dir * moveSpeed;

  // Gravità e velocità verticale
  vy -= gravity * dt;
  if (vy < -maxFallSpeed) vy = -maxFallSpeed;

  // Integrazione + collisioni
  moveAndCollideX(vx * dt);
  moveAndCollideY(vy * dt);

  //sincronizzazione passi personaggio a controlli
  const speed = Math.abs(vx);
    if (onGround && speed > 1) {
      let dur = (run_ref_speed / speed) * run_ref_dur;
      if (dur < run_min_dur) dur = run_min_dur;
      if (dur > run_max_dur) dur = run_max_dur;
      setRunDur(dur);
    } else {
        resetRunDur();
    }

  //far muovere i nemici
  for (const e of enemies) {
    if (!e.alive) continue;
    if (gameOver) break; 
    moveSpider(e, dt);   
  }

  //caduta nel vuoto
  if (!gameOver) {
  if (y < -64) { // sei caduta oltre la base dello schermo
    showLose("fell");
    }
  }

  // interazioni player ↔ spider (stomp / danno)
  handlePlayerEnemyInteractions();

  updateItems(dt);

  // VITTORIA: raggiungi il traguardo a destra
  if (!gameOver && x >= finishX) {
    showWin("reach-end");
  }

  // Aggiornamento camera
  camX = x - viewportWidth / 2 + playerdimensions.w / 2;
  camX = snap(camX);
  clampCam();

  world.style.setProperty('--camX', camX + 'px');

  // Limiti e rendering
  updateViewport();
  applyPosition();
  layoutParallax();
  updateParallax();
  updateAnimation();

  window.addEventListener('resize', () => {
  updateViewport();
  layoutParallax();
  });

  requestAnimationFrame(loop);
}

// Posizione iniziale visiva e avvio
applyPosition();
requestAnimationFrame(loop);
