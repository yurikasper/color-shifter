# Color Shifter

Match an image color to a reference by applying transformations, perfectly preserving gradients. Tranforms the entire image, unlike image editor "replace color" features that produce uneven results and don't cope well with variations.

Try it out [here](https://yurikasper.github.io/color-shifter/)

![Example showing Netflix logo in red and green](screenshots/netflix.png?raw=true "Example")

## Features:

- Simple Material Design 3 interface
- Eyedropper and color picker
- Saturation threshold: ignore grays/dim colors to avoid weird artifacts
- Preserves transparencies
- Ideal for single color illustrations with gradients

## Screenshots:

![User interface with eyedropper active and image (discord logo) intact](screenshots/UI_before.png?raw=true "User Interface")
![User interface with color picker open](screenshots/UI_picker.png?raw=true "Color Picker")
![User interface with image colors changed from purple to magenta](screenshots/UI_after.png?raw=true "Modified image")

## Bundle:

Build bundle from source with:
```
npx rollup -p @rollup/plugin-node-resolve index.js -o bundle.js
```
