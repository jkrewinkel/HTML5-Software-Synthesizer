class Filter{
    constructor(context){
        this.context = context;
        this.typeComponent = document.querySelector('.filterTypeSelect');
    }

    setValues() {
        this.cutoff = parseInt(this.cutoffControl.value);
        this.resonance = parseInt(this.resonanceControl.value);
        this.type = this.typeComponent.options[this.typeComponent.selectedIndex].value;
    }

    set cutoffComponent(component){
        this.cutoffControl = component;
    }
    set resonanceComponent(component){
        this.resonanceControl = component;
    }
}

export default Filter;