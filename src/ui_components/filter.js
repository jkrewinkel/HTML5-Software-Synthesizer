class Filter_Graphic{
    constructor(component, graphic){
        this.filterComponent = component;

        let graphicSize = graphic.getBoundingClientRect();
        this.height = graphicSize.height;
        this.width = graphicSize.width;

        this.path = graphic.querySelector('path');

        this.filterComponent.cutoffControl.afterUpdate = function(){
            this.updateGraphic();
        }.bind(this);
        this.filterComponent.resonanceControl.afterUpdate = function(){
            this.updateGraphic();
        }.bind(this);
        this.filterComponent.typeComponent.onchange = function(){
            this.updateGraphic();
        }.bind(this);
    }

    updateGraphic(){
        this.filterComponent.setValues();

        let cutoff = this.filterComponent.cutoff / 2;
        let q = ( - this.filterComponent.resonance) + 200;
        let draw;

        if( this.filterComponent.type === 'highpass') {

            draw = 'M' + (cutoff + 10) + ' 210';

            draw = draw + 'C' + (cutoff + 40) + ',' + q + ' ' + (cutoff + 40) + ',100 ' + (cutoff + 100) + ',100';

            draw = draw + ' L' + (cutoff + 200) + ' 100';

        } else {

            draw = 'M' + (cutoff + 60) + ' 210';

            draw = draw + 'C' + (cutoff + 30) + ',' + q + ' ' + (cutoff + 30) + ',100 ' + (cutoff - 30) + ',100';

            draw = draw + ' L' + (-10 - cutoff) + ' 100';

        }

        this.path.setAttribute('d', draw);
    }

}

export default Filter_Graphic;