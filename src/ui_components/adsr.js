class ADSR_Graphic{
    constructor(component, graphic){
        this.synthComponent = component;
        this.graphic = graphic;

        let graphicSize = graphic.getBoundingClientRect();
        this.height = graphicSize.height;
        this.width = graphicSize.width;

        this.path = graphic.querySelector('path');

        this.synthComponent.attackControl.afterUpdate = function(){
            this.updateGraphic();
        }.bind(this);
        this.synthComponent.decayControl.afterUpdate = function(){
            this.updateGraphic();
        }.bind(this);
        this.synthComponent.sustainControl.afterUpdate = function(){
            this.updateGraphic();
        }.bind(this);
        this.synthComponent.releaseControl.afterUpdate = function(){
            this.updateGraphic();
        }.bind(this);
    }

    updateGraphic(){

        this.synthComponent.setValues();

        let draw = '';

        let attack = (this.synthComponent.attackControl.value * 1.25);
        let decay = (this.synthComponent.decayControl.value * 1.25);
        let sustain = (((this.synthComponent.sustainControl.value * 100) / (250)) / 100);
        sustain = this.height - (sustain * this.height);
        if (sustain < 2) sustain = 1;
        else if (sustain > ( this.height - 1 ) ) sustain = this.height - 1;
        let release = this.synthComponent.releaseControl.value;

        draw += 'M1,' + this.height + ' ';

        // Attack (starts from lower left corner)
        if ( attack < 1 )
            draw += 'L1,1';
        else
            draw += 'Q1,1 ' + attack + ',1';

        // Decay (starts where attack ends with a curve downwards towards the sustain level)
        if ( decay < 1 )
            draw += 'L' + attack + ',' + sustain;
        else
            draw += 'Q' + attack + ',' + sustain + ' ' + (decay + attack) + ',' + sustain;

        // Sustain
        draw += 'L' + 700 + ',' + sustain;

        // Release
        draw += 'Q' + 700 + ',' + (this.height - 1) + ' ' + (700 + release) + ',' + (this.height - 1);

        // Add to svg
        this.path.setAttribute('d', draw);

    }
}

export default ADSR_Graphic;