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

},{"./synth_components/oscillator":3,"./ui_components/UI.js":4}],3:[function(require,module,exports){
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
        key: 'start',
        value: function start() {

            this.oscillators = [];

            // Create Oscillators depending on how many voices
            for (var i = 0; i < this.voicesControl.value; i++) {

                this.oscillators[i] = [];

                // Create the gain node
                this.oscillators[i]['gain'] = this.context.createGain();
                this.oscillators[i]['gain'].connect(this.context.destination);
                console.log(this.voicesControl.value);

                this.oscillators[i]['gain'].gain.value = (this.gainControl.value - this.gainControl.minVal) * 100 / (this.gainControl.maxVal - this.gainControl.minVal) / 100 / this.voicesControl.value;

                console.log(this.oscillators[i]['gain'].gain);
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

            // Play the oscillators
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.oscillators[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var osc = _step.value;

                    osc['osc'].start();
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
    }, {
        key: 'stop',
        value: function stop() {
            if (this.oscillators !== undefined) {
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = this.oscillators[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var osc = _step2.value;

                        osc['osc'].stop();
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

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _knob = require('./knob');

var _knob2 = _interopRequireDefault(_knob);

var _dragInput = require('./dragInput');

var _dragInput2 = _interopRequireDefault(_dragInput);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var UI = function () {
    function UI(synth) {
        _classCallCheck(this, UI);

        this.synth = synth;

        this.setupKnobs();
        this.setupDragInput();
        this.setupSelect();

        // Mouse up always disables any mousemove event handlers
        document.addEventListener('mouseup', function () {
            document.body.onmousemove = '';
        }.bind(this));
    }

    _createClass(UI, [{
        key: 'setupKnobs',
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
            }.bind(this));
        }
    }, {
        key: 'setupDragInput',
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
        key: 'setupSelect',
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
    }]);

    return UI;
}();

exports.default = UI;

},{"./dragInput":6,"./knob":7}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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

},{"./base":5}],7:[function(require,module,exports){
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

                _this.element.dataset.value = '0';

                _this.minVal = 0;
                _this.maxVal = 250;
                _this.value = 0;
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
                        //circle.setAttribute('data-endpoint', (circumference*0.33).toString() );

                        circle.startPoint = circumference;
                        circle.endPoint = circumference * 0.33;

                        circumference = circumference.toString();
                        //circle.setAttribute('data-startpoint', circumference);
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
                }
        }, {
                key: 'updateValue',
                value: function updateValue() {
                        document.body.onmousemove = function (event) {

                                var elementOffset = this.element.getBoundingClientRect();
                                var elementCenter = elementOffset.top + elementOffset.height / 2;
                                var cursorRelativeToCenter = (elementCenter - event.clientY) / 150;

                                if (cursorRelativeToCenter > 0) {

                                        if (this.lastCursorPosition < cursorRelativeToCenter && this.value < this.maxVal) this.value = this.value + cursorRelativeToCenter;else if (this.value > this.minVal) this.value = this.value - cursorRelativeToCenter;
                                } else {

                                        if (this.lastCursorPosition > cursorRelativeToCenter && this.value > this.minVal) this.value = this.value + cursorRelativeToCenter;else if (this.value < this.maxVal) this.value = this.value - cursorRelativeToCenter;
                                }

                                this.lastCursorPosition = cursorRelativeToCenter;

                                this.setStyle();
                        }.bind(this);
                }
        }]);

        return Knob;
}(_base2.default);

exports.default = Knob;

},{"./base":5}]},{},[1])

//# sourceMappingURL=build.js.map
