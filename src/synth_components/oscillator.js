class Oscillator{
    constructor(context){
        this.context = context;
    }
    setFrequency(halfStep){
        this.frequency = 440 * ( Math.pow( Math.pow(2, 1/12), (halfStep + this.pitchControl.value)) );
    }
    start(){

        this.oscillators = [];

        // Create Oscillators depending on how many voices
        for( let i = 0; i < this.voicesControl.value; i++ ){

            this.oscillators[i] = [];

            // Create the gain node
            this.oscillators[i]['gain'] = this.context.createGain();
            this.oscillators[i]['gain'].connect(this.context.destination);
            console.log(this.voicesControl.value);

            this.oscillators[i]['gain'].gain.value = ((((this.gainControl.value - this.gainControl.minVal) * 100) / (this.gainControl.maxVal - this.gainControl.minVal )/ 100) / this.voicesControl.value);

            console.log(this.oscillators[i]['gain'].gain);
            // Create the oscillator
            this.oscillators[i]['osc'] = this.context.createOscillator();
            this.oscillators[i]['osc'].connect(this.oscillators[i]['gain']);
            this.oscillators[i]['osc'].frequency.value = this.frequency;
            this.oscillators[i]['osc'].type = this.waveformControl.value;

        }

        // Detune depending on the detune control value
        if( this.oscillators.length > 0 ){
            let detune = this.detuneControl.value / 15;
            let oscBreadth = (this.voicesControl.value - 1) * detune;
            this.oscillators.forEach(function(osc, index){
                osc['osc'].frequency.value = (this.frequency  - (oscBreadth / 2)) + ( index *detune );
            }.bind(this));
        }

        // Play the oscillators
        for( let osc of this.oscillators ){
            osc['osc'].start();
        }

    }
    stop(){
        if(this.oscillators !== undefined ){
            for( let osc of this.oscillators ){
                osc['osc'].stop();
            }
        }
    }
    set detuneComponent(component){
        this.detuneControl = component;
    }
    set gainComponent(component){
        this.gainControl = component;
    }
    set pitchComponent(component){
        this.pitchControl = component;
    }
    set voicesComponent(component){
        this.voicesControl = component;
    }
    set waveformComponent(component){
        this.waveformControl = component;
    }
}

export default Oscillator;