# Afterhours

A survivors-style zombie game for phones, with HD-2D-inspired visuals: pixel-art characters in a 3D city at night, with tilt-shift blur, bloom, warm streetlights and neon.

Play it: https://claude.ai/artifact/A9SxxYUNJzv5x7B3hf7EvM

## How it plays

- Drag anywhere to move. You attack automatically.
- Zombies drop XP gems. Each level-up offers three upgrades.
- A horde arrives every 75 seconds. The Butcher (boss) arrives at 5:00.
- Survive 7:00 to reach sunrise and win.

| Weapons | Passives |
|---|---|
| Bare Fists, Pistol, Baseball Bat, Molotov, Hubcaps | Sneakers, Energy Drink, Protein Bar, Kevlar Vest, Magnet |

## Tech

One file, `index.html`, using three.js 0.160 from jsDelivr. All art is drawn in code (no image files). Sound is synthesized with Web Audio.

The file is written as page content for a Claude artifact, which adds the `<!doctype html>`, `<head>` and `<body>` wrapper.
