# Simone’s Life

A small 2D platformer in **HTML/CSS/JS** with a tilemap, parallax, collectibles, and “spider” enemies.

Press **Space** to start, move with the arrow keys, jump, pick up items, stomp or defeat the spiders!

---

## 🕹️ Gameplay

- **Start**: title screen; pressing **Space** hides the overlay and the game begins.
- **Movement**
  - **← / →** move the character  
  - **↑** jump
- **Score**: collect **cokes** to increase your score.
- **Paolino Power-up**: pick up the **burger** to transform into *Paolino* for a limited time.  
  - While *Paolino* is active, press **S** to **attack** (one-shot animation) that kills a spider within a configurable radius.
- **Enemies (spiders)**
  - They walk on their own, turn around at walls, and don’t fall off edges.  
  - **Stomp**: if you hit them **from above** while descending, they die and you bounce slightly.
  - **Side contact**: defeat (shows a “You Lose” screen).
- **Win**: reach the goal at the right end of the level. *(The optional “all spiders must be dead” condition is off by default.)*
- **Lose**: run into a spider **or** fall into the gaps.
- **Restart**: after the game ends, press **Space** to try again (**score resets**).

---

## ✨ Technical Features

- **ASCII tilemap** with a *legend* that maps characters → CSS classes/properties (solid, size, payload).
- **Three-layer parallax** (`background`, `parallax-back`, `parallax-front`) tied to the camera.
- **Simple physics**: gravity, jump, terminal fall speed, AABB collisions.
- **Entity system** for enemies (gravity, basic AI, turn at walls).
- **Items**: surprise blocks that drop **cokes** (points) and **burgers** (Paolino power-up).
- **CSS animations**: idle/run/jump/fall, *Paolino attack* (sheet) and *Spider walk*, synced to run speed.

---

## 🧩 Tilemap Legend

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

## 🗺️ Roadmap (ideas)
- More levels / load from file
- Checkpoints
- Audio (jump, item, kill, win/lose)
- Advanced HUD (lives, timer)
- More enemies / movement patterns
- Mobile touch controls
---

## 📜 Licenses & Credits

Code: specify a license (e.g., MIT) if you want others to reuse it.
Sprites, tiles, and backgrounds: Sophiaacodes.
