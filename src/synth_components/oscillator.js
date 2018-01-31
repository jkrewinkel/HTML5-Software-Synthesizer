class Oscillator{
    constructor(context){
        this.context = context;
    }
    setFrequency(halfStep){
        this.frequency = 440 * ( Math.pow( Math.pow(2, 1/12), halfStep) );
    }
    start(){
        this.oscillator = this.context.createOscillator();
        this.oscillator.connect(this.context.destination);
        this.oscillator.frequency.value = this.frequency;
        this.oscillator.start();
    }
    stop(){
        this.oscillator.stop();
    }
}

export default Oscillator;