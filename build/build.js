(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _synth = require("./synth.js");

var _synth2 = _interopRequireDefault(_synth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Instantiate the Synth
// And link the audio context container
var synth = new _synth2.default(new (window.AudioContext || window.webkitAudioContext)());

/*
    Getting the note frequencies:

    The base for calculating the frequencies is 440 Hz, this is a A4- the first
    A note above middle C (C4).

    All note frequencies are calculated from this point on with the following calculation:
    The base frequency TIMES the twelfth root of two TO THE POWER OF the amount of half steps from A4.
    In short: 440 * (2^(1/12))^h. Where h is the half steps away from A4 (which will be negative if 
    we travel to the left on the keyboard).
 */
var ul = document.getElementById("keyboard");
var items = ul.getElementsByTagName("li");

// When the user presses down on a keyboard list element
// we will calculate the frequency of the note and play it
for (var i = 0; i < items.length; ++i) {
    items[i].onmousedown = function () {
        synth.setFrequency(parseInt(this.dataset.half));
        synth.start();
    };
}

// On Mouseup we will stop all oscillators, I'm putting this on document.body
// instead of on the list elements because the user can hold down the key while
// still moving the mouse, which messes it all up
document.body.onmouseup = function () {
    synth.stop();
};

/*
 Shifting the keyboard to the left or right using the octave controls
 */
var octaveRange = 1; // The default state
document.querySelector('[data-ctrl="octave-left"]').addEventListener('click', function () {
    if (!this.classList.contains('active')) {
        document.querySelector('[data-ctrl="octave-right"]').classList.remove('active');
        octaveRange++;
        if (octaveRange > 1) this.classList.add('active');
        moveKeyboardOctave('down');
    }
});
document.querySelector('[data-ctrl="octave-right"]').addEventListener('click', function () {
    if (!this.classList.contains('active')) {
        document.querySelector('[data-ctrl="octave-left"]').classList.remove('active');
        octaveRange--;
        if (octaveRange < 1) this.classList.add('active');
        moveKeyboardOctave('up');
    }
});
function moveKeyboardOctave(direction) {
    var halfStep = void 0;
    if (direction === 'up') {
        for (var _i = 0; _i < items.length; ++_i) {
            halfStep = parseInt(items[_i].dataset.half) + 12;
            items[_i].dataset.half = half;
        }
    } else {
        for (var _i2 = 0; _i2 < items.length; ++_i2) {
            halfStep = parseInt(items[_i2].dataset.half) - 12;
            items[_i2].dataset.half = half;
        }
    }
}

},{"./synth.js":2}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _oscillator = require("./synth_components/oscillator");

var _oscillator2 = _interopRequireDefault(_oscillator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Synth = function () {
    function Synth(context) {
        _classCallCheck(this, Synth);

        this.context = context;
        this.oscillators = [new _oscillator2.default(context), new _oscillator2.default(context)];
    }

    _createClass(Synth, [{
        key: "setFrequency",
        value: function setFrequency(halfStep) {
            this.oscillators.forEach(function (osc) {
                osc.setFrequency(halfStep);
            });
        }
    }, {
        key: "start",
        value: function start() {
            this.oscillators.forEach(function (osc) {
                osc.start();
            });
        }
    }, {
        key: "stop",
        value: function stop() {
            this.oscillators.forEach(function (osc) {
                osc.stop();
            });
        }
    }, {
        key: "Oscillators",
        get: function get() {
            return this.oscillators;
        }
    }]);

    return Synth;
}();

exports.default = Synth;

},{"./synth_components/oscillator":3}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Oscillator = function () {
    function Oscillator(context) {
        _classCallCheck(this, Oscillator);

        this.context = context;
    }

    _createClass(Oscillator, [{
        key: "setFrequency",
        value: function setFrequency(halfStep) {
            this.frequency = 440 * Math.pow(Math.pow(2, 1 / 12), halfStep);
        }
    }, {
        key: "start",
        value: function start() {
            this.oscillator = this.context.createOscillator();
            this.oscillator.connect(this.context.destination);
            this.oscillator.frequency.value = this.frequency;
            this.oscillator.start();
        }
    }, {
        key: "stop",
        value: function stop() {
            this.oscillator.stop();
        }
    }]);

    return Oscillator;
}();

exports.default = Oscillator;

},{}]},{},[1])

//# sourceMappingURL=build.js.map
