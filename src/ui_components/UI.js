import Knob from "./knob";
import dragInput from './dragInput';
import ADSR_Graphic from "./../ui_components/adsr";
import Filter_Graphic from "./../ui_components/filter";

class UI{
    constructor(synth){
        this.synth = synth;

        this.setupKnobs();
        this.setupDragInput();
        this.setupSelect();

        this.setupADSR_Graphic();
        this.setupFilter_Graphic();

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
            if( element.dataset.componentparent === 'adsr' ){
                switch( element.dataset.componentcontrol ){
                    case 'attack':
                        this.synth.adsr.attackComponent = new Knob(element);
                        break;
                    case 'decay':
                        this.synth.adsr.decayComponent = new Knob(element);
                        break;
                    case 'sustain':
                        this.synth.adsr.sustainComponent = new Knob(element);
                        break;
                    case 'release':
                        this.synth.adsr.releaseComponent = new Knob(element);
                        break;
                }
            }
            if( element.dataset.componentparent === 'filter' ){
                switch( element.dataset.componentcontrol ){
                    case 'cutoff':
                        this.synth.filter.cutoffComponent = new Knob(element);
                        break;
                    case 'resonance':
                        this.synth.filter.resonanceComponent = new Knob(element);
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

    setupADSR_Graphic(){
        this.adsr_graphic = new ADSR_Graphic(this.synth.adsr, document.querySelector('svg#adsrGraphic'));
        this.synth.adsr.setValues();
        this.adsr_graphic.updateGraphic();
    }

    setupFilter_Graphic(){
        this.filter_graphic = new Filter_Graphic(this.synth.filter, document.querySelector('svg#filterGraphic'));
        this.synth.filter.setValues();
        this.filter_graphic.updateGraphic();
    }
}

export default UI;