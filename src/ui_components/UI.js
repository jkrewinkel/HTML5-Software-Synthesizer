import Knob from "./knob";

class UI{
    constructor(synth){
        this.synth = synth;

        this.setupKnobs();

        // Mouse up always disables any mousemove event handlers
        document.addEventListener('mouseup', function(){
            document.body.onmousemove = '';
        }.bind(this));
    }
    setupKnobs(){

        let knobElements = document.querySelectorAll('[data-component="knob"]');
        knobElements.forEach(function(element){
            if( element.dataset.componentparent === 'osc[0]' )
                this.synth.Oscillators[0].gainControl = new Knob(element);
        }.bind(this));

    }
}

export default UI;