import UI_Component_Base from './base';

class dragInput extends UI_Component_Base{

    constructor(element){
        super(element);

        this.value = parseInt(element.getAttribute('value'));
        this.previousValue = 0;
        this.minVal = parseInt(element.getAttribute('data-minVal'));
        this.maxVal = parseInt(element.getAttribute('data-maxVal'));

        this.element.onmousedown = function(){
            this.previousValue = this.value;
            this.updateValue();
        }.bind(this);

        this.setStyle();
    }

    updateValue(){
        document.body.onmousemove = function(event) {

            let elementOffset = this.element.getBoundingClientRect();
            let elementCenter = elementOffset.top + (elementOffset.height / 2);
            let cursorRelativeToCenter = (elementCenter - event.clientY) / 15;

            let rounded = Math.round(this.previousValue + cursorRelativeToCenter);
            if (rounded >= this.minVal && rounded <= this.maxVal)
                this.value = rounded;

            this.setStyle();

        }.bind(this);
    }

    setStyle(){
        this.element.value = this.value;
    }

}

export default dragInput;