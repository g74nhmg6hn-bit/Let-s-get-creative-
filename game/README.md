# Afterhours

A survivors-style zombie game for phones, with HD-2D-inspired visuals: pixel-art characters in a 3D city at night, with tilt-shift blur, bloom, warm streetlights and neon.

Play it: https://claude.ai/artifact/A9SxxYUNJzv5x7B3hf7EvM

## The hero: Makhi Gaddy

*"I don't run. I hold the line."*

Makhi grew up in the back of Gaddy's Gym, his family's boxing gym on 5th Avenue, and he's the strongest fighter on the block. The night the dead came, everyone ran. Makhi wrapped his hands, switched on the gym's neon sign, and walked into the intersection.

- **Iron Fists:** his starting weapon, heavy haymakers with big knockback.
- **Titan Slam:** knock out zombies to charge it, then tap the button (or press Space) to smash the street and blast back everything nearby.
- **Never Back Down:** below 30% health he hits 25% harder.
- **Look picker:** skin tone, hairstyle and gear colors, set from his profile on the title screen.

His sprite is 48px with 12 animation frames (idle, run, punch, hurt, victory, jump, slam), drawn in code.

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
