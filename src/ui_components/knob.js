import UI_Component_Base from './base';

class Knob extends UI_Component_Base{

    constructor(element){
        super(element);

        this._afterUpdate = null;

        this.minVal = 0;
        this.maxVal = 250;
        this.value = parseInt(this.element.dataset.value);
        this.percentage = ((this.value - this.minVal) * 100) / (this.maxVal - this.minVal);
        this.lastCursorPosition = 0;

        this.dial = this.createDial();

        this.setStyle();

        this.element.onmousedown = function(){
            this.updateValue();
        }.bind(this);
    }

    set afterUpdate(event){
        this._afterUpdate = event;
    }

    createDial(){

        let elementOffset = this.element.getBoundingClientRect();
        let dimension = elementOffset.width + 10;

        let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute("width", dimension.toString());
        svg.setAttribute("height", dimension.toString());
        svg.setAttribute("viewBox", '0 0 '+dimension.toString()+' '+dimension.toString());

        let circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        let radius = (dimension / 2) - 4;
        circle.setAttribute('cx', (dimension /2).toString());
        circle.setAttribute('cy', (dimension /2).toString());
        circle.setAttribute('r', radius.toString());
        circle.setAttribute('fill', 'none');
        circle.setAttribute('stroke', 'black');
        circle.setAttribute('stroke-width', '1');

        let circumference = (2 * Math.PI * radius);

        circle.startPoint = circumference;
        circle.endPoint = (circumference*0.33);

        circumference = circumference.toString();
        circle.setAttribute('stroke-dasharray', circumference + ' ' + circumference);
        circle.setAttribute('stroke-dashoffset', (radius*0.33).toString());

        svg.appendChild(circle);
        this.element.parentNode.appendChild(svg);

        return circle;

    }

    setStyle(){
        let val = this.value - (this.maxVal / 2);
            val = "rotate(" + val + "deg)";
        this.element.style.transform = val;
        this.element.style.webkitTransform = val;
        this.element.style.MozTransform = val;
        this.element.style.msTransform = val;
        this.element.style.OTransform = val;

        // Get percentage of value
        let valPercentage = ((this.value - this.minVal) * 100) / (this.maxVal - this.minVal);

        // Get dial value
        let dialVal = (this.dial.endPoint - this.dial.startPoint) * ((100-valPercentage) / 100 );

        // Set percentage of dial
        this.dial.setAttribute('stroke-dashoffset', (this.dial.endPoint - dialVal).toString() );

        if( this._afterUpdate )
            this._afterUpdate();

    }

    updateValue(){
        document.body.onmousemove = function(event) {

            let elementOffset = this.element.getBoundingClientRect();
            let elementCenter = elementOffset.top + (elementOffset.height / 2);
            let cursorRelativeToCenter = (elementCenter - event.clientY) / 20;

            if (cursorRelativeToCenter > 0 ) {

                if ((this.lastCursorPosition < cursorRelativeToCenter) &&
                    (this.value <= this.maxVal))
                    this.value = this.value + cursorRelativeToCenter;
                else if (this.value >= this.minVal)
                    this.value = this.value - cursorRelativeToCenter;

            } else {

                if ((this.lastCursorPosition > cursorRelativeToCenter) &&
                    (this.value >= this.minVal))
                    this.value = this.value + cursorRelativeToCenter;
                else if (this.value <= this.maxVal)
                    this.value = this.value - cursorRelativeToCenter;

            }

            this.lastCursorPosition = cursorRelativeToCenter;
            this.percentage = ((this.value - this.minVal) * 100) / (this.maxVal - this.minVal);

            this.setStyle();

        }.bind(this);
    }
}

export default Knob;