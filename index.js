import '@material/web/button/filled-button.js';
import '@material/web/button/outlined-button.js';
import '@material/web/slider/slider.js';
import '@material/web/fab/fab.js';
import '@material/web/icon/icon.js';
import '@material/web/textfield/outlined-text-field.js';
import '@material/web/iconbutton/icon-button.js';

import initProcess from './process.js';
import { reloadImage }  from './process.js';

window.addEventListener('load', () => {
    //color selector
    document.querySelector('#color-to').addEventListener('open', function() {
        Coloris({
                alpha: false
            });
    }, false);
    //color-from input background color reaction
    document.querySelector('#color-from').addEventListener('input', ()=>{
        document.documentElement.style.setProperty('--color-from', document.querySelector('#color-from').value);
    });
    //color picker button
    document.querySelector('#color-picker-button').addEventListener('click', pickerStart);
    //download button
    document.querySelector('#save-image').addEventListener('click', downloadCanvas);
    //load button
    document.querySelector('#load-image').addEventListener('click', () => document.querySelector('#file').click());

    initProcess();
});

function pickerStart() {
    document.querySelector('#image').classList.add('picker-cursor');
    document.querySelector('#image').addEventListener('click', pickerEnd);
    //reload image to reset all processing
    reloadImage();
}

function pickerEnd(e) {
    document.querySelector('#image').classList.remove('picker-cursor');
    document.querySelector('#image').removeEventListener('click', pickerEnd);
    //get click coordinates
    var [x, y] = getPickerPosition(document.querySelector('#image'), e);
    var [r, g, b, a] = colorAt(x, y);
    var hex = rgbToHex(r, g, b);
    document.querySelector('#color-from').value = hex;
    //update color preview
    document.documentElement.style.setProperty('--color-from', document.querySelector('#color-from').value);
}

function getPickerPosition(canvas, event) {
    //define picker icon size for calculating offset
    const pickerSize = 24;
    const rect = canvas.getBoundingClientRect()
    //remove bounding rectangle offset and consider picking position at bottom left
    const x = event.clientX - rect.left - (pickerSize/2)
    const y = event.clientY - rect.top + (pickerSize/2)
    return [Math.round(x), Math.round(y)];
}

function colorAt(x, y) {
    return document.querySelector('#image').getContext('2d').getImageData(x, y, 1, 1).data;
}

function downloadCanvas(){
    let link = document.createElement('a');
    let filename = document.querySelector('#file').files[0].name
    if(filename) {
        link.download = `processed_${filename}`;
    } else {
        link.download = 'processed.png';
    }
    link.href = document.querySelector('#image').toDataURL()
    link.click();
}

//third party functions
function componentToHex(c) {
var hex = c.toString(16);
return hex.length == 1 ? "0" + hex : hex;
}
function rgbToHex(r, g, b) {
return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}