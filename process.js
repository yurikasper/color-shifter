//create image object
var image = new Image();

export default function init() {
    //bind "transform" button click
    document.querySelector('#submit-button').addEventListener('click', () => {
        processImage('image', document.querySelector('#color-from').value, document.querySelector('#color-to').value);
    });

    //load image
    document.querySelector('#file').onchange = loadImage;

    //demo image
    image.src = 'media/netflix.png';
    draw();
}

function draw() {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext("2d");
    canvas.id = 'image';
    canvas.setAttribute("class", "canvas");

    image.onload = function() {
        canvas.width = image.width;
        canvas.height = image.height;

        ctx.drawImage(image, 0, 0, image.width, image.height);
        document.querySelector('#image-container').appendChild(canvas);
    }
    
}

function loadImage() {
        image = new Image();
        image.src = URL.createObjectURL(document.querySelector('#file').files[0]);

        if(document.querySelector('#image')){
            document.querySelector('#image').remove();
        }

    draw();
}

export function reloadImage() {
    image_reloaded = new Image();
    image_reloaded.src = image.src;
    var canvas = document.querySelector('#image');
    var ctx = canvas.getContext("2d");
    image_reloaded.onload = function() {
        canvas.width = image_reloaded.width;
        canvas.height = image_reloaded.height;
        ctx.drawImage(image_reloaded, 0, 0, image.width, image.height);
    }
}

//Load image and apply tranform to every canvas pixel
function processImage(canvasId, oldColor, newColor){
    //get canvas and load image
    var canvas = document.getElementById(canvasId);
    var ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, image.width, image.height);

    //calculate transform from one color to another
    var oldColor = hexToHsl(oldColor);
    var newColor = hexToHsl(newColor);
    var transformH = newColor[0] - oldColor[0];
    var transformS = newColor[1] / oldColor[1];
    var transformL = newColor[2] / oldColor[2]; 
    var transform = [transformH, transformS, transformL];

    //process each pixel
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (var i = 0; i < data.length; i += 4) {
        var rgb = [data[i], data[i+1], data[i+2]];
        var processed = processPixel(rgb, transform);
        data[i]     = processed[0];     // red
        data[i + 1] = processed[1];     // green
        data[i + 2] = processed[2];     // blue
    }
    //put processed pixel data back into canvas
    ctx.putImageData(imageData, 0, 0);
}

//takes RGB color and transform properties (Hue rotation, Saturation and Lightness scaling)
function processPixel(rgb, transform){
    
    var hsl = rgbToHsl(rgb[0], rgb[1], rgb[2]);

    //variable saturation threshold. If below, return unprocessed values
    if(hsl[1] < document.querySelector('#saturation-slider').value) return rgb;
    //H
    hsl[0] += transform[0] % 1;
    //S
    hsl[1] *= transform[1];
    //L
    hsl[2] *= transform[2];

    var rgb = hslToRgb(hsl[0],hsl[1],hsl[2]);

    var r = rgb[0];
    var g = rgb[1];
    var b = rgb[2];

    return [r, g, b];
}

function hexToHsl(hex){
    var rgb = hexToRgb(hex);
    return rgbToHsl(rgb.r, rgb.g, rgb.b);
}


//third party functions
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function rgbToHsl(r, g, b) {
    r /= 255, g /= 255, b /= 255;

    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if (max == min) {
        h = s = 0; // achromatic
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
        }

        h /= 6;
    }

    return [ h, s, l ];
}

function hslToRgb(h, s, l) {
    var r, g, b;

    if (s == 0) {
        r = g = b = l; // achromatic
    } else {
        function hue2rgb(p, q, t) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;

        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [ r * 255, g * 255, b * 255 ];
}