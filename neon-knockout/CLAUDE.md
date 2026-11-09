# Neon Knockout — project guide for Claude Code

An original 2D side-scrolling beat 'em up that runs in the browser. Juno fights through a neon street and an underground garage to reach the gang boss, Baron Volt, on a rooftop. Everything (pixel art, animation, music, sound effects, font) is generated in code. There are **no external assets**, and that must stay true: all characters, art, music and text must be original.

The owner is Brad, a solo developer. He's not a deep coder, so explain changes in plain language.

## Build and run
- `npm install`, then `npx playwright install chromium` (only needed for the tests)
- `npm run build`: concatenates `src/*.js` (in filename order) into `shell.html` and writes `dist/index.html`. That single file is the whole game.
- Play: open `dist/index.html` in a browser, or run `npm run serve` and open http://localhost:3000
- The build has **no bundler and no modules**. Every file shares one global script scope, so a top-level function in one file is visible to all the others.

## Source layout (`src/`)
| File | What's in it |
|---|---|
| `00_core.js` | Constants (virtual resolution 480x270, FLOOR=184, DEPTH=74), helpers, settings in localStorage (`nk_settings`), difficulty table `DIFFS`, and the **input layer** (keyboard, mouse, gamepad, touch buttons and stick). Each tick, `I.poll()` fills `I.p[action]` (pressed this tick), `I.held` and `I.move` |
| `10_audio.js` | Web Audio synthesis: `AU.sfx(name)` sound effects, and a step-sequencer music engine with `SONGS` (title, street, garage, boss, win). The audio unlocks on the first user gesture |
| `20_gfx.js` | 5x7 bitmap font (`text`, `neon`), **character rigs** (`RIGS`, pose library `AP`, `targetPose`, `drawRig`), props and pickups, particles (`P`, `sparks`, `hitFX`, `ghost`) |
| `30_bg.js` | Procedural parallax backgrounds for each theme (`street`, `garage`, `roof`) plus live layers: neon signs, flicker, rain, lights |
| `40_game.js` | Game data and logic: `LEVELS` (waves and props), `TYPES` (enemy stats), `ATK` (every attack's frames, damage, knockback, hit-stop), `damage()`, player controller, enemy AI, boss AI, projectiles, level and wave flow, results and rank |
| `50_ui.js` | Scenes (title, how to play, settings, scores, credits, play, results), menus, pause, HUD, `render()` |
| `60_main.js` | Fixed 60 Hz timestep loop, `resize()`, and the `window.NK` test hooks |

## How characters are drawn
Characters are **not sprite sheets**. Each one is a skeleton rig (hip, legs, torso, arms, head) posed by joint angles (`P0()` keys: `ln` lean, `cr` crouch, `rot` body rotation, `fa1/fa2` front arm, `ba1/ba2` back arm, `fl1/fl2` front leg, `bl1/bl2` back leg). Every frame, `targetPose(a)` picks a pose and the current pose eases toward it. `drawRig()` stamps chunky pixel limbs with a 1px outline, a shaded side and a neon rim light (`RIM`, set per theme). It also adds springy secondary parts (`SEC`: hair, jacket tail, scarf, hood, cape) and facial expressions (`exprOf`). Attack poses live in `AP[attackName] = [windup, strike]`.

## Combat model (key facts)
- An attack in `ATK` has `dur` (total frames), `a0..a1` (active frames), `dmg`, `kb`, `launch`, `knock`, `gb` (guard break), `hs` (hit-stop frames), `rch` (reach) and `st` (forward step).
- Player chain: `l1 → l2 → l3`. Pressing heavy after `l1` or `l2` gives `fin` (an uppercut launcher). `hv` is the heavy attack. In the air, light is `jk` and heavy is `dive`. Signs use `sw1`/`sw2`. The knee in a grab is `knee`.
- Riot Wall (`shield`) blocks frontal hits unless the attack has `gb`, comes from behind, or is a thrown body or crate.
- The boss uses poise: hits do nothing until its poise breaks. It has 3 phases at 66% and 33% HP.
- A perfect dodge is a roll within the first frames of an incoming hit. It triggers slow motion.

## Testing (self-play bot)
- `npm test` builds the game, then `test/play.mjs` loads it headlessly in Playwright. A bot plays every stage and the boss, retries after deaths, saves screenshots to `test/shots/`, and prints stage times, HP, score, deaths and move stats (`NK.ST`). Set `DIFF=0|1|2` to test Easy, Normal or Hard.
- `npm run test:ui`: menus, settings saving, pause, mouse, a **mocked gamepad**, and a phone-landscape touch test.
- `npm run test:perf`: render time per frame for each stage (currently about 1–2 ms).
- Set `CHROME=/path/to/chrome` if Playwright's bundled Chromium isn't installed.
- Test hooks: `NK.manual=true` stops the real-time loop, `NK.step(n)` advances n ticks, `NK.render()`, `NK.bot` (runs after input polling), `NK.G` (game state).

Last balance check: on Normal the bot clears both stages and loses to the boss about half the time. Hard takes it several tries.

## Conventions
- Keep it a single self-contained HTML file with no network loads. Wrap localStorage access in try/catch (this is already done in `store`).
- After any change: run `npm test` and `npm run test:ui`, look at the screenshots, and check that `ERRORS 0` prints.
- Pixel-crisp rendering: round coordinates, no smoothing, and draw text with the bitmap font only.

## Ideas / next steps
- Give each enemy type a stronger silhouette of its own (bulkier grunt, lankier Needle, more heavily armored Riot Wall).
- Sprite Fusion MCP (a tilemap editor) is available to connect: `claude mcp add --transport http spritefusion https://www.spritefusion.com/mcp`. Possible use: hand-built tile layouts for the stage backgrounds, replacing the code-generated ones in `30_bg.js`. First check what its tools can do and what format they export.
- More content: a stage between the garage and the rooftop, more enemy types, co-op.
- Published preview (Claude artifact): https://claude.ai/artifact/V2YHdGzJ3yWaAdpXgP3YPN
