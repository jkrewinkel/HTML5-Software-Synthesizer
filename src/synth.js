import UI from "./ui_components/UI.js";
import Oscillator from "./synth_components/oscillator";
import ADSR from "./synth_components/adsr";

class Synth{
    constructor(context){
        this.context = context;
        this.oscillators = [
            new Oscillator(context),
            new Oscillator(context),
        ];
        this.adsr = new ADSR(context);
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

            let oscLevel = osc.getLevel();
            osc.create();

            let attack = (this.adsr.attack / 200);
            let decay = (this.adsr.decay / 100);

            for( let oscillator of osc.oscillators ){

                // Starts at 0, ramps up to oscLevel over the time of the attackControl value
                oscillator['gain'].gain.setValueAtTime(0.001, this.context.currentTime);

                let sustain = this.adsr.getSustain();
                sustain = (oscLevel * sustain) / osc.oscillators.length;
                if ( sustain < 0.002 ) sustain = 0.001;

                oscillator['gain'].gain.exponentialRampToValueAtTime(oscLevel, this.context.currentTime + attack);
                oscillator['gain'].gain.exponentialRampToValueAtTime(sustain, (this.context.currentTime + attack) + decay);
            }

        }.bind(this));

        // Play the oscillators
        this.oscillators.forEach(function(osc){
            for( let oscillator of osc.oscillators ){
                oscillator['osc'].start();
            }
        });

    }

    stop(){
        let release = (this.adsr.release / 200);

        this.oscillators.forEach(function(osc){
            osc.stop(this.context.currentTime + release, this.adsr.sustain);
        }.bind(this));
    }

    setupUI(){
        this.UI = new UI(this);
    }
}

export default Synth;