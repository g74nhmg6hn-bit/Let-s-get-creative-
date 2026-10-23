# Unity assets for Afterhours

## Makhi Gaddy sprite sheets

`makhi/makhi_<gear>.png`: one sheet per gear colorway (crimson, royal, venom, gold), all with the High top hairstyle and the default skin tone.

Each sheet is 192×144 px: a 4×3 grid of 48×48 frames on a transparent background. Frame order, left to right and top to bottom:

| Row | Frames |
|---|---|
| 1 | idle0, idle1, run0, run1 |
| 2 | run2, run3, punch0, punch1 |
| 3 | hurt, victory, jump, slam |

## Import settings (keep the pixels crisp)

Select the PNG in the Project window and set:

- **Texture Type:** Sprite (2D and UI)
- **Sprite Mode:** Multiple
- **Pixels Per Unit:** 16
- **Filter Mode:** Point (no filter)
- **Compression:** None
- **Generate Mip Maps:** off

Click **Apply**, then open the **Sprite Editor** and choose **Slice → Grid By Cell Size → 48 × 48**, with **Pivot: Bottom Center**. Click **Slice**, then **Apply**.

## Suggested animation timing

| Clip | Frames | Speed |
|---|---|---|
| Idle | idle0, idle1 | 2–3 fps, loop |
| Run | run0–run3 | 10 fps, loop |
| Punch | punch0 (short), punch1 | 0.05 s, then 0.17 s |
| Titan Slam | jump, slam | 0.25 s each |
| Hurt / Victory | single frame | hold |
