# Neon Knockout: character art prompts

Copy-paste prompts for an AI sprite or image generator, one for each character in the game. Every prompt ends with the same style line, so the five characters come out matching.

The details (outfits, colors, size, gear) come from the game code: the `RIGS` colors and `SEC` parts in `src/20_gfx.js`, and the enemy behavior in `src/40_game.js`. The hex colors are the ones the game uses now. Keep them, or change them in the prompt and the game together.

**Tips**
- Generate Juno first. When you're happy with her, give her image as the style reference for the others.
- Ask for one pose at a time (idle first), then reuse the same prompt and change only the pose line.
- Sizes: Juno is the base size. Grunt and Riot Wall are a little bigger, Needle is a little smaller and lankier, and Baron Volt is about 1.4× Juno's height.

---

## 1. Juno (the hero)

```
Pixel art sprite of JUNO, a young female street brawler and the hero of a neon beat 'em up. Athletic, light build, confident fighting stance facing right. Bright hot-pink hair (#ff2a8a, highlights #ff7ac0) swept back into a long ponytail that streams behind her. Fitted cyan cropped jacket (#16c9d9, shade #0b7d8c) with a long tail that flaps behind her waist. Dark indigo pants (#2b1f52), white high-top sneakers (#f4f4f8). Warm light skin (#f1b58c). Bandaged fists raised, determined grin. Fast and agile.
Style: side-view 2D beat 'em up character, chunky pixel art, about 64 px tall, 1 px dark outline (#0c0614), one shaded side, cyan/magenta neon rim light, transparent background, no anti-aliasing, full body.
```

## 2. Spark Grunt (basic enemy)

```
Pixel art sprite of SPARK GRUNT, a stocky street thug from the "Static Kings" gang, enemy in a neon beat 'em up. Bulky shoulders, thick arms, slightly hunched brawler stance facing left. Bright orange hoodie (#ff7a1a, shade #b14c0a) with the hood up and the hood's tail flopping behind his head; the hoodie hangs below his waist. Charcoal grey cargo pants (#3b3b4a), black boots (#1c1c24). Tan skin (#c98b62). Scowl, fists up, ready to throw wild haymakers. Small electric-spark logo on the chest.
Style: side-view 2D beat 'em up character, chunky pixel art, about 68 px tall, 1 px dark outline (#0c0614), one shaded side, cyan/magenta neon rim light, transparent background, no anti-aliasing, full body.
```

## 3. Riot Wall (shield enemy)

```
Pixel art sprite of RIOT WALL, a heavily armored gang enforcer, enemy in a neon beat 'em up. Broad and tanky, slow and heavy, planted defensive stance facing left. Full riot helmet with a dark visor; royal-blue armored jacket with chest and shoulder plates (#3d5bd0, shade #263a8a). Holds a big transparent riot shield in front of his body, with a glowing blue edge and a scratched "STATIC KINGS" spray tag. Dark navy pants (#22253a), black combat boots (#0f1018). Brown skin (#a8735a) visible at the jaw. Shield-bash pose energy.
Style: side-view 2D beat 'em up character, chunky pixel art, about 72 px tall, 1 px dark outline (#0c0614), one shaded side, cyan/magenta neon rim light, transparent background, no anti-aliasing, full body.
```

## 4. Needle (knife thrower)

```
Pixel art sprite of NEEDLE, a lanky, wiry knife-thrower from the "Static Kings" gang, enemy in a neon beat 'em up. Thin build with long legs, light on their feet, sly crouched stance facing left. Wears a glowing green visor across the eyes and a long neon-green scarf (#7dff3f, highlights #d4ff8a) trailing behind the neck. Forest-green fitted jacket (#2b9a4a, shade #1a6330), near-black pants (#1d1d2b), grey sneakers (#3a3a48). Light skin (#e0a07a). Holding throwing knives fanned between the fingers, ready to throw.
Style: side-view 2D beat 'em up character, chunky pixel art, about 62 px tall, 1 px dark outline (#0c0614), one shaded side, cyan/magenta neon rim light, transparent background, no anti-aliasing, full body.
```

## 5. Baron Volt (final boss)

```
Pixel art sprite of BARON VOLT, "King of Static", the gang boss and final boss of a neon beat 'em up. Huge, powerful, about 1.4x the hero's height, imposing chest-out stance facing left. Gold crown on his head crackling with electricity. Royal purple suit jacket (#6a1fb0, shade #43127a) under a long, heavy dark-violet cape (#2e0a52) with gold trim (#ffd23f) that billows behind him. Dark plum pants (#1e1428), shiny gold boots (#d4a017). Deep brown skin (#8a5a3e). Purple lightning arcs around his fists. Smug, menacing grin. He calls down lightning bolts, sends shockwaves along the ground, and charges like a bull.
Style: side-view 2D beat 'em up character, chunky pixel art, about 90 px tall, 1 px dark outline (#0c0614), one shaded side, purple and gold neon rim light, transparent background, no anti-aliasing, full body.
```

---

## Poses to generate for each character

Replace the stance in the prompt with one of these:

| Everyone | Juno only | Enemies | Baron Volt only |
|---|---|---|---|
| idle (fists up, slight bounce) | 3-hit punch combo | Grunt: wild haymaker | lightning-summon (arm raised) |
| walk cycle | uppercut launcher | Riot Wall: shield bash, shield block | ground slam shockwave |
| hurt (recoiling back) | heavy punch | Needle: knife throw | bull charge |
| knocked down (lying flat) | jump kick, dive kick | | cape-sweep stagger |
| victory | dodge roll, grab and throw | | |
