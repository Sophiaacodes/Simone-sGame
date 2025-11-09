# Simone-sGame
Un piccolo platform 2D in HTML/CSS/JS con tilemap, parallax, collezionabili e nemici “ragni”.
Premi Spazio per iniziare, muoviti con le frecce, salta, raccogli gli oggetti, schiaccia o sconfiggi i ragni!

🕹️ Gameplay


Start: schermata iniziale con titolo; premendo Spazio scompare l’overlay e parte il gioco.


Movimento:


← / → muovi il personaggio


↑ salta




Punti: raccogli le coke per aumentare lo score.


Power-up Paolino: raccogli il burger per trasformarti in Paolino per un tempo limitato.


Quando Paolino è attivo, premi S per un attacco (animazione one-shot) che uccide un ragno nel raggio definito.




Nemici (ragni):


Camminano da soli, girano davanti ai muri e non cadono dai bordi.


Schiacciamento: se li colpisci dall’alto mentre stai scendendo, muoiono e rimbalzi leggermente.


Contatto laterale: perdi (schermata di sconfitta).




Vittoria: attualmente vinci raggiungendo il traguardo a destra del livello (puoi anche rimuovere la condizione “tutti i ragni morti”, vedi sotto).


Sconfitta: vai a sbattere contro un ragno oppure cadi nel vuoto tra i blocchi.


Restart: a partita finita, premi Spazio per ricominciare (lo score viene azzerato).



✨ Caratteristiche tecniche


Tilemap ASCII → generazione del livello con una legend che mappa i caratteri a classi CSS e proprietà (solido, dimensioni, payload).


Parallax a tre layer (background, parallax-back, parallax-front) agganciato alla camera.


Fisica semplice: gravità, salto, cap su velocità di caduta, collisioni AABB con blocchi solidi.


Nemici come “entity” con gravità, AI base (cammina/gira), AABB vs player.


Item system: spawn “coke” e “burger” dai blocchi sorpresa, raccolta con AABB.


Animazioni CSS per idle/run/jump/fall, Paolino attack e Spider walk, con sincronizzazione velocità dei passi.



🧩 Legend della tilemap
Nelle righe del level ogni carattere genera un elemento:
const legend = {
  ' ': null,
  '€': { classes: "ground normal",         w: 2, h: 2, solid: true },
  '$': { classes: "ground angled-left",    w: 2, h: 2, solid: true },
  '?': { classes: "ground angled-right",   w: 2, h: 2, solid: true },
  '!': { classes: "ground vertical-left",  w: 2, h: 2, solid: true },
  '#': { classes: "ground vertical-right", w: 2, h: 2, solid: true },
  'X': { classes: "ground underground",    w: 2, h: 2, solid: true },
  'B': { classes: "brick",                 w: 1, h: 1, solid: true },
  'C': { classes: "full-surprise",         w: 1, h: 1, solid: true, payload: "coke"   },
  'M': { classes: "full-surprise",         w: 1, h: 1, solid: true, payload: "burger" },
  'S': { classes: "",                      w: 1, h: 1, solid: false, enemyType: "spider" }
};



Inserisci S nella mappa per spawnare un ragno.


I blocchi C/M diventano “empty-surprise” dopo essere stati colpiti dal basso e dropperanno l’item relativo.



🧪 Comandi


Spazio — start / restart dopo vittoria/sconfitta


← / → — muovi


↑ — salta


S — Paolino attack (solo mentre il power-up è attivo)



🛠️ Come eseguire


Clona o scarica il progetto (HTML, CSS, JS e cartella assets/).


Avvia un piccolo server locale (consigliato per caricare asset senza problemi CORS):


VS Code: estensione Live Server


Python 3:
python -m http.server 8080



Node (serve):
npx serve .





Apri http://localhost:8080 (o la porta usata).


Premi Spazio per iniziare!



🧰 Configurazione rapida
Dentro lo script, puoi ritoccare questi parametri:
// Fisica e movimento
const moveSpeed     = 220;
const jumpSpeed     = 420;
const gravity       = 650;
const maxFallSpeed  = 900;

// Animazione corsa (sincronizzata alla velocità)
const run_ref_speed = 220;
const run_ref_dur   = 0.60;
const run_min_dur   = 0.18;
const run_max_dur   = 0.60;

// Nemici
const spider_w = 64, spider_h = 64;  // dimensioni sprite
// Ai ragni puoi cambiare e.vx (velocità) quando li crei

Raggio attacco Paolino: const attack_range_tile = 6; (in tile, moltiplicato per cell in px).
Grandezza tile: CSS :root { --tile: 32px }.

🏁 Condizioni di fine partita


Sconfitta


Collisione laterale con un ragno


Caduta sotto una certa quota (y < -64)


Mostra il pannello #lostgame e blocca il loop di gioco




Vittoria


Raggiungi il traguardo a destra: x >= finishX


Mostra #wongame





Se non vuoi che la vittoria dipenda anche dall’eliminare tutti i ragni, hai già rimosso la condizione nel loop (lasciando solo “reach-end”). Se volessi riattivarla, aggiungi:
const anyAlive = enemies.some(e => e.alive);
if (!anyAlive) showWin("all-spiders-dead");



🔁 Restart & punteggio


A fine partita, Spazio chiama resetGame():


Nasconde i pannelli


Ricostruisce il livello e i nemici


Rimette il player alla posizione iniziale


Azzera lo score:
cokeCount = 0;
updateScoreBoard();






📁 Struttura (indicativa)
/
├─ index.html
├─ styles.css
├─ game.js
└─ assets/
   ├─ bg/
   │  ├─ mountains.webp
   │  ├─ hills.webp
   │  └─ clouds.webp
   ├─ tiles/
   │  ├─ ground_320.png
   │  ├─ ground_320_01.png
   │  ├─ ground_320_02.png
   │  ├─ ground_320_03.png
   │  ├─ brick.png
   │  ├─ brick_32_suprise.png
   │  └─ brick_32_surprise_opened.png
   └─ sprites/
      ├─ Player_idle.png
      ├─ player_run_sheet.png
      ├─ Player_jump_takeoff.png
      ├─ Player_jump_fall.png
      ├─ paolino_idle.png
      ├─ paolino_run_sheet.png
      ├─ paolino_jump_takeoff.png
      ├─ paolino_jump_fall.png
      ├─ paolino_attack_sheet.png
      └─ spider_walk_sheet.png

(adatta i nomi ai tuoi asset effettivi — nel codice li hai già referenziati).

🧭 Suggerimenti & Debug


Se Paolino attack non si vede: assicurati che la classe .player.paolino-attack sia corretta e che prima rimuovi le altre classi (lo fai già), eventualmente resetta l’animazione con:
player.classList.remove('paolino-attack');
void player.offsetWidth;
player.classList.add('paolino-attack');



Se “fluttua” nei salti: controlla jumpSpeed, gravity e che moveAndCollideY() setti onGround = true quando collidi dal basso.



🗺️ Roadmap (idee)


Più livelli / caricamento da file


Checkpoint


Audio (salto, item, kill, win/lose)


HUD avanzato (vite, timer)


Altri nemici / pattern di movimento


Mobile touch controls



📜 Licenze & Crediti


Codice: specifica la licenza (es. MIT) se vuoi che altri possano riutilizzarlo.


Sprite, tile e sfondi: assicurati di avere i diritti o di indicare gli autori/licenze.

