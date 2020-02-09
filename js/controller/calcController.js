class CalcController {
    constructor() { //construtor é chamado automaticamente quando uma classe é instanciada
        //para atributos usamos a palavra this, o _ por convensão é privado e são necessarios getters e setters
        this._operation = [];
        this._locale = "pt-br";
        this._currentDate;
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");
        this.initialize();
    }

    initialize() {
        this.setDisplayDateTime();
        let interval = setInterval(() => this.setDisplayDateTime(), 1000);
        this.initButtonsEvents();
    }

    addEventListenerAll(obj, events, fn) {
        events.split(" ").forEach(event => {
            obj.addEventListener(event, fn);
        });
    }

    clearAll() {
        this._operation = [];
    }

    cancelEntry() {
        this._operation.pop();
    }

    setError() {
        this.displayCalc = "ERROR";
    }

    getLastOperation() {
        return this._operation[this._operation.length - 1];
    }

    isOperator(value) {
        return ["+", "-", "/", "*", "%"].indexOf(value) > -1;
    }

    setLastOperation(value) {
        this._operation[this._operation.length - 1] = value;
    }


    calc(){
        let last = this._operation.pop();
        let result = this._operation.join("");
        this._operation = [result, last];
    }

    pushOperation(value) {
        this._operation.push(value);
        if (this._operation.length > 3){
            this.calc();
        }
    }

    setLastNumberToDisplay(){
        
    }

    addOperation(value) {
        if (isNaN(this.getLastOperation())) 
            if (this.isOperator(value))
                this.setLastOperation(value);
            else if (isNaN(value))
                console.log("Outra coisa", value);
            else
                this.pushOperation(value);
        else
            if (this.isOperator(value))
                this.pushOperation(value);
            else {
                let newValue = this.getLastOperation().toString() + value.toString();
                this.setLastOperation(parseInt(newValue));
                this.setLastNumberToDisplay();
            }
}

execBtn(value) {
    switch (value) {
        case "ac":
            this.clearAll()
            break;
        case "ce":
            this.cancelEntry();
            break;
        case "porcento":
            this.addOperation("%");
            break;
        case "divisao":
            this.addOperation("/");
            break;
        case "multiplicacao":
            this.addOperation("*");
            break;
        case "subtracao":
            this.addOperation("-");
            break;
        case "soma":
            this.addOperation("+");
            break;
        case "igual":
            break;
        case "ponto":
            this.addOperation(".");
            break;
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
            this.addOperation(parseInt(value));
            break;
        default:
            this.setError();
    }
}

initButtonsEvents() {
    let buttons = document.querySelectorAll("#buttons > g, #parts > g");

    buttons.forEach((btn, index) => {

        this.addEventListenerAll(btn, "mouseover mouseup mousedown", e => {
            btn.style.cursor = "pointer";
        });

        this.addEventListenerAll(btn, "click drag", e => {
            let txtBtn = btn.className.baseVal.replace("btn-", "");

            this.execBtn(txtBtn);
        });
    });
}

setDisplayDateTime() {
    this.displayDate = this.currentDate.toLocaleDateString(this._locale, {
        day: "2-digit",
        month: "long",
        year: "numeric"
    });
    this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
}

get displayTime() {
    return this._timeEl.innerHTML;
}

set displayTime(value) {
    this._timeEl.innerHTML = value;
}

get displayDate() {
    return this._dateEl.innerHTML;
}

set displayDate(value) {
    this._dateEl.innerHTML = value;
}

get displayCalc() { //get para identificar que é um geter
    return this._displayCalcEl.innerHTML;
}

set displayCalc(value) { //set para identificar que é um seter, quando for chamado sera reconhecido como um "atributo"
    this._displayCalcEl.innerHTML = value;
}

get currentDate() {
    return new Date();
}

set currentDate(value) {
    this._currentDate = value;
}
}