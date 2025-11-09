# Simone’s Life

Un piccolo platform 2D in **HTML/CSS/JS** con tilemap, parallax, collezionabili e nemici “ragni”.

Premi **Spazio** per iniziare, muoviti con le frecce, salta, raccogli gli oggetti, schiaccia o sconfiggi i ragni!

---

## 🕹️ Gameplay

- **Start**: schermata iniziale con titolo; premendo **Spazio** scompare l’overlay e parte il gioco.
- **Movimento**
  - **← / →** muovi il personaggio  
  - **↑** salta
- **Punti**: raccogli le **coke** per aumentare lo score.
- **Power-up Paolino**: raccogli il **burger** per trasformarti in *Paolino* per un tempo limitato.  
  - Quando *Paolino* è attivo, premi **S** per un **attacco** (animazione one-shot) che uccide un ragno entro un raggio configurabile.
- **Nemici (ragni)**
  - Camminano autonomamente, girano davanti ai muri e non cadono dai bordi.  
  - **Schiacciamento**: se li colpisci **dall’alto** mentre stai scendendo, muoiono e rimbalzi leggermente.
  - **Contatto laterale**: sconfitta (schermata di “You Lose”).
- **Vittoria**: raggiungi il traguardo a destra del livello. *(L’eventuale condizione “tutti i ragni morti” è disattivata di default.)*
- **Sconfitta**: vai a sbattere contro un ragno **oppure** cadi nel vuoto tra i blocchi.
- **Restart**: a partita finita, premi **Spazio** per ricominciare (lo **score viene azzerato**).

---

## ✨ Caratteristiche tecniche

- **Tilemap ASCII** con *legend* che mappa caratteri → classi CSS/proprietà (solido, dimensioni, payload).
- **Parallax** a tre layer (`background`, `parallax-back`, `parallax-front`) agganciato alla camera.
- **Fisica semplice**: gravità, salto, limite alla velocità di caduta, collisioni AABB.
- **Entity system** per i nemici (gravità, AI base, giro davanti ai muri).
- **Items**: blocchi sorpresa che droppano **coke** (punti) e **burger** (power-up Paolino).
- **Animazioni CSS**: idle/run/jump/fall, *Paolino attack* (sheet) e *Spider walk*, sincronizzate con la velocità di corsa.

---

## 🧩 Legend della tilemap

```js
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
```
---

## 🗺️ Roadmap (idee)
- Più livelli / caricamento da file
- Checkpoint
- Audio (salto, item, kill, win/lose)
- HUD avanzato (vite, timer)
- Altri nemici / pattern di movimento
- Mobile touch controls
---

## 📜 Licenze & Crediti

Codice: specifica la licenza (es. MIT) se vuoi che altri possano riutilizzarlo.
Sprite, tile e sfondi: Sophiaacodes.
