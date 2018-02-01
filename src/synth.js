import UI from "./ui_components/UI.js";
import Oscillator from "./synth_components/oscillator";

class Synth{
    constructor(context){
        this.context = context;
        this.oscillators = [
            new Oscillator(context),
            new Oscillator(context),
        ];
    }

    get Oscillators(){
        return this.oscillators;
    }

    setFrequency(halfStep){
        this.oscillators.forEach(function(osc){
            osc.setFrequency(halfStep);
        });
    }

    start(){
        this.oscillators.forEach(function(osc){
            osc.start();
        });
    }

    stop(){
        this.oscillators.forEach(function(osc){
           osc.stop();
        });
    }

    setupUI(){
        this.UI = new UI(this);
    }
}

export default Synth;