class ADSR{
    constructor(context){
        this.context = context;
    }

    setValues() {
        this.attack = parseInt(this.attackControl.value);
        this.decay = parseInt(this.decayControl.value);
        this.sustain = parseInt(this.sustainControl.value);
        this.release = parseInt(this.releaseControl.value);
    }

    getSustain(){
        let sustainVal = ((this.sustain * 100) / 250) / 100;
        if (sustainVal > 0){
            if ( sustainVal > 1 ) return 1;
            else return sustainVal;
        }
        else return 0.001;
    }

    set attackComponent(component){
        this.attackControl = component;
    }
    set decayComponent(component){
        this.decayControl = component;
    }
    set sustainComponent(component){
        this.sustainControl = component;
    }
    set releaseComponent(component){
        this.releaseControl = component;
    }
}

export default ADSR;