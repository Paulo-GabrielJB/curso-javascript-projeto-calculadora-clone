class CalcController{
    constructor(){ //construtor é chamado automaticamente quando uma classe é instanciada
        //para atributos usamos a palavra this, o _ por convensão é privado e são necessarios getters e setters
        this._locale = "pt-br";
        this._currentDate;
        this._displayCalcEl = document.querySelector("#display"); 
        this._dateEl = document.querySelector("#data"); 
        this._timeEl = document.querySelector("#hora");
        this.initialize();
    }

    initialize(){
        this.setDisplayDateTime();
        let interval = setInterval(() => this.setDisplayDateTime(), 1000);
        this.initButtonsEvents();
    }

    addEventListenerAll(obj ,events, fn){
        events.split(" ").forEach(event => {
            obj.addEventListener(event, fn);
        });
    }

    initButtonsEvents(){
        let buttons = document.querySelectorAll("#buttons > g, #parts > g");
        
        buttons.forEach((btn, index) => {

            this.addEventListenerAll(btn, "mouseover mouseup mousedown", e => {
                btn.style.cursor = "pointer";
            });

            this.addEventListenerAll(btn, "click drag", e => {
                console.log(btn.className.baseVal.replace("btn-", ""));
            });
        });
    }

    setDisplayDateTime(){
        this.displayDate = this.currentDate.toLocaleDateString(this._locale, {
            day: "2-digit",
            month: "long",
            year: "numeric"
        });
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
    }    

    get displayTime(){
        return this._timeEl.innerHTML;
    }

    set displayTime(value){
        this._timeEl.innerHTML = value;
    }

    get displayDate(){
        return this._dateEl.innerHTML;
    }

    set displayDate(value){
        this._dateEl.innerHTML = value;
    }

    get displayCalc(){ //get para identificar que é um geter
        return this._displayCalcEl.innerHTML;
    }

    set displayCalc(value){ //set para identificar que é um seter, quando for chamado sera reconhecido como um "atributo"
        this._displayCalcEl.innerHTML = value;
    }

    get currentDate(){
        return new Date();
    }

    set currentDate(value){
        this._currentDate = value;
    }
}