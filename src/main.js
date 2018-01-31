"use strict";

import Synth from './synth.js';

// Instantiate the Synth
// And link the audio context container
const synth = new Synth(new ( window.AudioContext || window.webkitAudioContext )());

/*
    Getting the note frequencies:

    The base for calculating the frequencies is 440 Hz, this is a A4- the first
    A note above middle C (C4).

    All note frequencies are calculated from this point on with the following calculation:
    The base frequency TIMES the twelfth root of two TO THE POWER OF the amount of half steps from A4.
    In short: 440 * (2^(1/12))^h. Where h is the half steps away from A4 (which will be negative if 
    we travel to the left on the keyboard).
 */
const ul = document.getElementById("keyboard");
const items = ul.getElementsByTagName("li");

// When the user presses down on a keyboard list element
// we will calculate the frequency of the note and play it
for (let i = 0; i < items.length; ++i) {
    items[i].onmousedown = function(){
        synth.setFrequency(parseInt(this.dataset.half));
        synth.start();
    }

}

// On Mouseup we will stop all oscillators, I'm putting this on document.body
// instead of on the list elements because the user can hold down the key while
// still moving the mouse, which messes it all up
document.body.onmouseup = function(){
   synth.stop();
};

/*
 Shifting the keyboard to the left or right using the octave controls
 */
let octaveRange = 1; // The default state
document.querySelector('[data-ctrl="octave-left"]').addEventListener('click', function(){
    if( !this.classList.contains('active')) {
        document.querySelector('[data-ctrl="octave-right"]').classList.remove('active');
        octaveRange++;
        if( octaveRange > 1 ) this.classList.add('active');
        moveKeyboardOctave('down');
    }
});
document.querySelector('[data-ctrl="octave-right"]').addEventListener('click', function(){
    if( !this.classList.contains('active')) {
        document.querySelector('[data-ctrl="octave-left"]').classList.remove('active');
        octaveRange--;
        if( octaveRange < 1 ) this.classList.add('active');
        moveKeyboardOctave('up');
    }
});
function moveKeyboardOctave( direction ){
    let halfStep;
    if( direction === 'up' ){
        for (let i = 0; i < items.length; ++i) {
            halfStep = parseInt(items[i].dataset.half) + 12;
            items[i].dataset.half = half;
        }
    } else {
        for (let i = 0; i < items.length; ++i) {
            halfStep = parseInt(items[i].dataset.half) - 12;
            items[i].dataset.half = half;
        }
    }
}