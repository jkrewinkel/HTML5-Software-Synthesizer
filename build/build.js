(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _synth = require("./synth.js");

var _synth2 = _interopRequireDefault(_synth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Instantiate the Synth
// And link the audio context container
var synth = new _synth2.default(new (window.AudioContext || window.webkitAudioContext)());
synth.setupUI();

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
document.addEventListener('mouseup', function () {
    synth.stop();
});

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

var _UI = require("./ui_components/UI.js");

var _UI2 = _interopRequireDefault(_UI);

var _oscillator = require("./synth_components/oscillator");

var _oscillator2 = _interopRequireDefault(_oscillator);

var _adsr = require("./synth_components/adsr");

var _adsr2 = _interopRequireDefault(_adsr);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Synth = function () {
    function Synth(context) {
        _classCallCheck(this, Synth);

        this.context = context;
        this.oscillators = [new _oscillator2.default(context), new _oscillator2.default(context)];
        this.adsr = new _adsr2.default(context);
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

                var oscLevel = osc.getLevel();
                osc.create();

                var attack = this.adsr.attack / 200;
                var decay = this.adsr.decay / 100;

                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = osc.oscillators[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var oscillator = _step.value;


                        // Starts at 0, ramps up to oscLevel over the time of the attackControl value
                        oscillator['gain'].gain.setValueAtTime(0.001, this.context.currentTime);

                        var sustain = this.adsr.getSustain();
                        sustain = oscLevel * sustain / osc.oscillators.length;
                        if (sustain < 0.002) sustain = 0.001;

                        oscillator['gain'].gain.exponentialRampToValueAtTime(oscLevel, this.context.currentTime + attack);
                        oscillator['gain'].gain.exponentialRampToValueAtTime(sustain, this.context.currentTime + attack + decay);
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
            }.bind(this));

            // Play the oscillators
            this.oscillators.forEach(function (osc) {
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = osc.oscillators[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var oscillator = _step2.value;

                        oscillator['osc'].start();
                    }
                } catch (err) {
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion2 && _iterator2.return) {
                            _iterator2.return();
                        }
                    } finally {
                        if (_didIteratorError2) {
                            throw _iteratorError2;
                        }
                    }
                }
            });
        }
    }, {
        key: "stop",
        value: function stop() {
            var release = this.adsr.release / 200;

            this.oscillators.forEach(function (osc) {
                osc.stop(this.context.currentTime + release, this.adsr.sustain);
            }.bind(this));
        }
    }, {
        key: "setupUI",
        value: function setupUI() {
            this.UI = new _UI2.default(this);
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

},{"./synth_components/adsr":3,"./synth_components/oscillator":4,"./ui_components/UI.js":5}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ADSR = function () {
    function ADSR(context) {
        _classCallCheck(this, ADSR);

        this.context = context;
    }

    _createClass(ADSR, [{
        key: "setValues",
        value: function setValues() {
            this.attack = parseInt(this.attackControl.value);
            this.decay = parseInt(this.decayControl.value);
            this.sustain = parseInt(this.sustainControl.value);
            this.release = parseInt(this.releaseControl.value);
        }
    }, {
        key: "getSustain",
        value: function getSustain() {
            var sustainVal = this.sustain * 100 / 250 / 100;
            if (sustainVal > 0) {
                if (sustainVal > 1) return 1;else return sustainVal;
            } else return 0.001;
        }
    }, {
        key: "attackComponent",
        set: function set(component) {
            this.attackControl = component;
        }
    }, {
        key: "decayComponent",
        set: function set(component) {
            this.decayControl = component;
        }
    }, {
        key: "sustainComponent",
        set: function set(component) {
            this.sustainControl = component;
        }
    }, {
        key: "releaseComponent",
        set: function set(component) {
            this.releaseControl = component;
        }
    }]);

    return ADSR;
}();

exports.default = ADSR;

},{}],4:[function(require,module,exports){
'use strict';

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
        key: 'setFrequency',
        value: function setFrequency(halfStep) {
            this.frequency = 440 * Math.pow(Math.pow(2, 1 / 12), halfStep + this.pitchControl.value);
        }
    }, {
        key: 'getLevel',
        value: function getLevel() {
            var oscLevel = (this.gainControl.value - this.gainControl.minVal) * 100 / (this.gainControl.maxVal - this.gainControl.minVal) / 100 / this.voicesControl.value;
            if (oscLevel > 0) return oscLevel;else return 0.001;
        }
    }, {
        key: 'create',
        value: function create() {

            this.oscillators = [];

            // Create Oscillators depending on how many voices
            for (var i = 0; i < this.voicesControl.value; i++) {

                this.oscillators[i] = [];

                // Create the gain node
                this.oscillators[i]['gain'] = this.context.createGain();
                this.oscillators[i]['gain'].connect(this.context.destination);

                // Create the oscillator
                this.oscillators[i]['osc'] = this.context.createOscillator();
                this.oscillators[i]['osc'].connect(this.oscillators[i]['gain']);
                this.oscillators[i]['osc'].frequency.value = this.frequency;
                this.oscillators[i]['osc'].type = this.waveformControl.value;
            }

            // Detune depending on the detune control value
            if (this.oscillators.length > 0) {
                var detune = this.detuneControl.value / 15;
                var oscBreadth = (this.voicesControl.value - 1) * detune;
                this.oscillators.forEach(function (osc, index) {
                    osc['osc'].frequency.value = this.frequency - oscBreadth / 2 + index * detune;
                }.bind(this));
            }
        }
    }, {
        key: 'stop',
        value: function stop(when, sustain) {
            if (this.oscillators !== undefined) {
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = this.oscillators[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var osc = _step.value;

                        osc['gain'].gain.exponentialRampToValueAtTime(0.01, when);
                        osc['osc'].stop(when);
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
            }
        }
    }, {
        key: 'detuneComponent',
        set: function set(component) {
            this.detuneControl = component;
        }
    }, {
        key: 'gainComponent',
        set: function set(component) {
            this.gainControl = component;
        }
    }, {
        key: 'pitchComponent',
        set: function set(component) {
            this.pitchControl = component;
        }
    }, {
        key: 'voicesComponent',
        set: function set(component) {
            this.voicesControl = component;
        }
    }, {
        key: 'waveformComponent',
        set: function set(component) {
            this.waveformControl = component;
        }
    }]);

    return Oscillator;
}();

exports.default = Oscillator;

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _knob = require("./knob");

var _knob2 = _interopRequireDefault(_knob);

var _dragInput = require("./dragInput");

var _dragInput2 = _interopRequireDefault(_dragInput);

var _adsr = require("./../ui_components/adsr");

var _adsr2 = _interopRequireDefault(_adsr);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var UI = function () {
    function UI(synth) {
        _classCallCheck(this, UI);

        this.synth = synth;

        this.setupKnobs();
        this.setupDragInput();
        this.setupSelect();

        this.setupADSR_Graphic();

        // Mouse up always disables any mousemove event handlers
        document.addEventListener('mouseup', function () {
            document.body.onmousemove = '';
        }.bind(this));
    }

    _createClass(UI, [{
        key: "setupKnobs",
        value: function setupKnobs() {
            var knobElements = document.querySelectorAll('[data-component="knob"]');
            knobElements.forEach(function (element) {
                if (element.dataset.componentparent === 'osc[0]') {
                    switch (element.dataset.componentcontrol) {
                        case 'level':
                            this.synth.Oscillators[0].gainComponent = new _knob2.default(element);
                            break;
                        case 'detune':
                            this.synth.Oscillators[0].detuneComponent = new _knob2.default(element);
                            break;
                    }
                }
                if (element.dataset.componentparent === 'osc[1]') {
                    switch (element.dataset.componentcontrol) {
                        case 'level':
                            this.synth.Oscillators[1].gainComponent = new _knob2.default(element);
                            break;
                        case 'detune':
                            this.synth.Oscillators[1].detuneComponent = new _knob2.default(element);
                            break;
                    }
                }
                if (element.dataset.componentparent === 'adsr') {
                    switch (element.dataset.componentcontrol) {
                        case 'attack':
                            this.synth.adsr.attackComponent = new _knob2.default(element);
                            break;
                        case 'decay':
                            this.synth.adsr.decayComponent = new _knob2.default(element);
                            break;
                        case 'sustain':
                            this.synth.adsr.sustainComponent = new _knob2.default(element);
                            break;
                        case 'release':
                            this.synth.adsr.releaseComponent = new _knob2.default(element);
                            break;
                    }
                }
                if (element.dataset.componentparent === 'filter') {}
            }.bind(this));
        }
    }, {
        key: "setupDragInput",
        value: function setupDragInput() {
            var dragInputElements = document.querySelectorAll('[data-component="dragInput"]');
            dragInputElements.forEach(function (element) {
                if (element.dataset.componentparent === 'osc[0]') {
                    switch (element.dataset.componentcontrol) {
                        case 'pitch':
                            this.synth.Oscillators[0].pitchComponent = new _dragInput2.default(element);
                            break;
                        case 'voices':
                            this.synth.Oscillators[0].voicesComponent = new _dragInput2.default(element);
                            break;
                    }
                }
                if (element.dataset.componentparent === 'osc[1]') {
                    switch (element.dataset.componentcontrol) {
                        case 'pitch':
                            this.synth.Oscillators[1].pitchComponent = new _dragInput2.default(element);
                            break;
                        case 'voices':
                            this.synth.Oscillators[1].voicesComponent = new _dragInput2.default(element);
                            break;
                    }
                }
            }.bind(this));
        }
    }, {
        key: "setupSelect",
        value: function setupSelect() {
            var selects = document.querySelectorAll('select.waveformSelect');
            selects.forEach(function (element) {
                if (element.dataset.componentparent === 'osc[0]') {
                    this.synth.Oscillators[0].waveformComponent = element;
                }
                if (element.dataset.componentparent === 'osc[1]') {
                    this.synth.Oscillators[1].waveformComponent = element;
                }
            }.bind(this));
        }
    }, {
        key: "setupADSR_Graphic",
        value: function setupADSR_Graphic() {
            this.adsr_graphic = new _adsr2.default(this.synth.adsr, document.querySelector('svg#adsrGraphic'));
            this.synth.adsr.setValues();
            this.adsr_graphic.updateGraphic();
        }
    }]);

    return UI;
}();

exports.default = UI;

},{"./../ui_components/adsr":6,"./dragInput":8,"./knob":9}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ADSR_Graphic = function () {
    function ADSR_Graphic(component, graphic) {
        _classCallCheck(this, ADSR_Graphic);

        this.synthComponent = component;
        this.graphic = graphic;

        var graphicSize = graphic.getBoundingClientRect();
        this.height = graphicSize.height;
        this.width = graphicSize.width;

        this.path = graphic.querySelector('path');

        this.synthComponent.attackControl.afterUpdate = function () {
            this.updateGraphic();
        }.bind(this);
        this.synthComponent.decayControl.afterUpdate = function () {
            this.updateGraphic();
        }.bind(this);
        this.synthComponent.sustainControl.afterUpdate = function () {
            this.updateGraphic();
        }.bind(this);
        this.synthComponent.releaseControl.afterUpdate = function () {
            this.updateGraphic();
        }.bind(this);
    }

    _createClass(ADSR_Graphic, [{
        key: 'updateGraphic',
        value: function updateGraphic() {

            this.synthComponent.setValues();

            var draw = '';

            var attack = this.synthComponent.attackControl.value * 1.25;
            var decay = this.synthComponent.decayControl.value * 1.25;
            var sustain = this.synthComponent.sustainControl.value * 100 / 250 / 100;
            sustain = this.height - sustain * this.height;
            if (sustain < 2) sustain = 1;else if (sustain > this.height - 1) sustain = this.height - 1;
            var release = this.synthComponent.releaseControl.value;

            draw += 'M1,' + this.height + ' ';

            // Attack (starts from lower left corner)
            if (attack < 1) draw += 'L1,1';else draw += 'Q1,1 ' + attack + ',1';

            // Decay (starts where attack ends with a curve downwards towards the sustain level)
            if (decay < 1) draw += 'L' + attack + ',' + sustain;else draw += 'Q' + attack + ',' + sustain + ' ' + (decay + attack) + ',' + sustain;

            // Sustain
            draw += 'L' + 700 + ',' + sustain;

            // Release
            draw += 'Q' + 700 + ',' + (this.height - 1) + ' ' + (700 + release) + ',' + (this.height - 1);

            // Add to svg
            this.path.setAttribute('d', draw);
        }
    }]);

    return ADSR_Graphic;
}();

exports.default = ADSR_Graphic;

},{}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var UI_Component_Base = function UI_Component_Base(element) {
    _classCallCheck(this, UI_Component_Base);

    this.element = element;
};

exports.default = UI_Component_Base;

},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var dragInput = function (_UI_Component_Base) {
    _inherits(dragInput, _UI_Component_Base);

    function dragInput(element) {
        _classCallCheck(this, dragInput);

        var _this = _possibleConstructorReturn(this, (dragInput.__proto__ || Object.getPrototypeOf(dragInput)).call(this, element));

        _this.value = parseInt(element.getAttribute('value'));
        _this.previousValue = 0;
        _this.minVal = parseInt(element.getAttribute('data-minVal'));
        _this.maxVal = parseInt(element.getAttribute('data-maxVal'));

        _this.element.onmousedown = function () {
            this.previousValue = this.value;
            this.updateValue();
        }.bind(_this);

        _this.setStyle();
        return _this;
    }

    _createClass(dragInput, [{
        key: 'updateValue',
        value: function updateValue() {
            document.body.onmousemove = function (event) {

                var elementOffset = this.element.getBoundingClientRect();
                var elementCenter = elementOffset.top + elementOffset.height / 2;
                var cursorRelativeToCenter = (elementCenter - event.clientY) / 15;

                var rounded = Math.round(this.previousValue + cursorRelativeToCenter);
                if (rounded >= this.minVal && rounded <= this.maxVal) this.value = rounded;

                this.setStyle();
            }.bind(this);
        }
    }, {
        key: 'setStyle',
        value: function setStyle() {
            this.element.value = this.value;
        }
    }]);

    return dragInput;
}(_base2.default);

exports.default = dragInput;

},{"./base":7}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
        value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Knob = function (_UI_Component_Base) {
        _inherits(Knob, _UI_Component_Base);

        function Knob(element) {
                _classCallCheck(this, Knob);

                var _this = _possibleConstructorReturn(this, (Knob.__proto__ || Object.getPrototypeOf(Knob)).call(this, element));

                _this._afterUpdate = null;

                _this.minVal = 0;
                _this.maxVal = 250;
                _this.value = parseInt(_this.element.dataset.value);
                _this.lastCursorPosition = 0;

                _this.dial = _this.createDial();

                _this.setStyle();

                _this.element.onmousedown = function () {
                        this.updateValue();
                }.bind(_this);
                return _this;
        }

        _createClass(Knob, [{
                key: 'createDial',
                value: function createDial() {

                        var elementOffset = this.element.getBoundingClientRect();
                        var dimension = elementOffset.width + 10;

                        var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                        svg.setAttribute("width", dimension.toString());
                        svg.setAttribute("height", dimension.toString());
                        svg.setAttribute("viewBox", '0 0 ' + dimension.toString() + ' ' + dimension.toString());

                        var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                        var radius = dimension / 2 - 4;
                        circle.setAttribute('cx', (dimension / 2).toString());
                        circle.setAttribute('cy', (dimension / 2).toString());
                        circle.setAttribute('r', radius.toString());
                        circle.setAttribute('fill', 'none');
                        circle.setAttribute('stroke', 'black');
                        circle.setAttribute('stroke-width', '1');

                        var circumference = 2 * Math.PI * radius;

                        circle.startPoint = circumference;
                        circle.endPoint = circumference * 0.33;

                        circumference = circumference.toString();
                        circle.setAttribute('stroke-dasharray', circumference + ' ' + circumference);
                        circle.setAttribute('stroke-dashoffset', (radius * 0.33).toString());

                        svg.appendChild(circle);
                        this.element.parentNode.appendChild(svg);

                        return circle;
                }
        }, {
                key: 'setStyle',
                value: function setStyle() {
                        var val = this.value - this.maxVal / 2;
                        val = "rotate(" + val + "deg)";
                        this.element.style.transform = val;
                        this.element.style.webkitTransform = val;
                        this.element.style.MozTransform = val;
                        this.element.style.msTransform = val;
                        this.element.style.OTransform = val;

                        // Get percentage of value
                        var valPercentage = (this.value - this.minVal) * 100 / (this.maxVal - this.minVal);

                        // Get dial value
                        var dialVal = (this.dial.endPoint - this.dial.startPoint) * ((100 - valPercentage) / 100);

                        // Set percentage of dial
                        this.dial.setAttribute('stroke-dashoffset', (this.dial.endPoint - dialVal).toString());

                        if (this._afterUpdate) this._afterUpdate();
                }
        }, {
                key: 'updateValue',
                value: function updateValue() {
                        document.body.onmousemove = function (event) {

                                var elementOffset = this.element.getBoundingClientRect();
                                var elementCenter = elementOffset.top + elementOffset.height / 2;
                                var cursorRelativeToCenter = (elementCenter - event.clientY) / 20;

                                if (cursorRelativeToCenter > 0) {

                                        if (this.lastCursorPosition < cursorRelativeToCenter && this.value <= this.maxVal) this.value = this.value + cursorRelativeToCenter;else if (this.value >= this.minVal) this.value = this.value - cursorRelativeToCenter;
                                } else {

                                        if (this.lastCursorPosition > cursorRelativeToCenter && this.value >= this.minVal) this.value = this.value + cursorRelativeToCenter;else if (this.value <= this.maxVal) this.value = this.value - cursorRelativeToCenter;
                                }

                                this.lastCursorPosition = cursorRelativeToCenter;

                                this.setStyle();
                        }.bind(this);
                }
        }, {
                key: 'afterUpdate',
                set: function set(event) {
                        this._afterUpdate = event;
                }
        }]);

        return Knob;
}(_base2.default);

exports.default = Knob;

},{"./base":7}]},{},[1])

//# sourceMappingURL=build.js.map
