import Knob from "./knob";
import dragInput from './dragInput';

class UI{
    constructor(synth){
        this.synth = synth;

        this.setupKnobs();
        this.setupDragInput();
        this.setupSelect();

        // Mouse up always disables any mousemove event handlers
        document.addEventListener('mouseup', function(){
            document.body.onmousemove = '';
        }.bind(this));
    }

    setupKnobs(){
        let knobElements = document.querySelectorAll('[data-component="knob"]');
        knobElements.forEach(function(element){
            if( element.dataset.componentparent === 'osc[0]' ){
                switch( element.dataset.componentcontrol ){
                    case 'level':
                        this.synth.Oscillators[0].gainComponent = new Knob(element);
                        break;
                    case 'detune':
                        this.synth.Oscillators[0].detuneComponent = new Knob(element);
                        break;
                }
            }
            if( element.dataset.componentparent === 'osc[1]' ){
                switch( element.dataset.componentcontrol ){
                    case 'level':
                        this.synth.Oscillators[1].gainComponent = new Knob(element);
                        break;
                    case 'detune':
                        this.synth.Oscillators[1].detuneComponent = new Knob(element);
                        break;
                }
            }
        }.bind(this));

    }

    setupDragInput(){
        let dragInputElements = document.querySelectorAll('[data-component="dragInput"]');
        dragInputElements.forEach(function(element){
            if( element.dataset.componentparent === 'osc[0]' ) {
                switch (element.dataset.componentcontrol) {
                    case 'pitch':
                        this.synth.Oscillators[0].pitchComponent = new dragInput(element);
                        break;
                    case 'voices':
                        this.synth.Oscillators[0].voicesComponent = new dragInput(element);
                        break;
                }
            }
            if( element.dataset.componentparent === 'osc[1]' ) {
                switch (element.dataset.componentcontrol) {
                    case 'pitch':
                        this.synth.Oscillators[1].pitchComponent = new dragInput(element);
                        break;
                    case 'voices':
                        this.synth.Oscillators[1].voicesComponent = new dragInput(element);
                        break;
                }
            }
        }.bind(this));
    }

    setupSelect(){
        let selects = document.querySelectorAll('select.waveformSelect');
        selects.forEach(function(element){
            if( element.dataset.componentparent === 'osc[0]' ) {
                this.synth.Oscillators[0].waveformComponent = element;
            }
            if( element.dataset.componentparent === 'osc[1]' ) {
                this.synth.Oscillators[1].waveformComponent = element;
            }
        }.bind(this));
    }
}

export default UI;