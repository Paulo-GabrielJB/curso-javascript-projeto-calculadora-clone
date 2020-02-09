class CalcController {
    constructor() { //construtor é chamado automaticamente quando uma classe é instanciada
        //para atributos usamos a palavra this, o _ por convensão é privado e são necessarios getters e setters
        this._lastOperator = "";
        this._lastNumber = "";
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
        this.setLastNumberToDisplay();
        this.initiKeyBoard();
        this.pasteFromClipboard();
    }

    copyToClipboard(){
        let input = document.createElement("input"); //cria um elemento
        input.value = this.displayCalc;
        document.body.appendChild(input); //adiciona o elemento criado ao body
        input.select(); //seleciona o input
        document.execCommand("Copy"); //copia tudo oq esta selecionado
        input.remove();
    }

    pasteFromClipboard(){
        document.addEventListener("paste", e => {
            let txt =  e.clipboardData.getData("Text");
            this.displayCalc = isNaN(txt) ? 0 : txt;
        })
    }

    initiKeyBoard() {
        document.addEventListener("keyup", e => {
            switch (e.key) {
                case "Escape":
                    this.clearAll()
                    break;
                case "Backspace":
                    this.cancelEntry();
                    break;
                case "%":
                case "/":
                case "*":
                case "-":
                case "+":
                    this.addOperation(e.key);
                    break;
                case "Enter":
                case "=":
                    this.calc();
                    break;
                case ".":
                case ",":
                    this.addDot();
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
                    this.addOperation(e.key);
                    break;
                case "c":
                    if(e.ctrlKey)
                        this.copyToClipboard();
                    break;
            }
        });
    }

    addEventListenerAll(obj, events, fn) {
        events.split(" ").forEach(event => {
            obj.addEventListener(event, fn);
        });
    }

    clearAll() {
        this._operation = [];
        this._lastNumber = "";
        this._lastOperator = "";
        this.setLastNumberToDisplay();
    }

    cancelEntry() {
        this._operation.pop();
        this.setLastNumberToDisplay();
    }

    setError() {
        this.displayCalc = "ERROR";
    }

    getLastOperation() {
        return this._operation[this._operation.length - 1];
    }

    isOperator(value) {
        return (["+", "-", "/", "*", "%"].indexOf(value) > -1);
    }

    setLastOperation(value) {
        this._operation[this._operation.length - 1] = value;
    }

    getResult() {

        return eval(this._operation.join(""));
    }

    calc() {
        let last = "";
        this._lastOperator = this.getLastItem();

        if (this._operation.length < 3) {
            let firsItem = this._operation[0];
            this._operation = [firsItem, this._lastOperator, this._lastNumber];
        }


        if (this._operation.length > 3) {
            last = this._operation.pop();
            this._lastNumber = this.getResult();
        }
        else if (this._operation.length = 3) {
            this._lastNumber = this.getLastItem(false);
        }

        let result = this.getResult();
        if (last == "%") {
            result /= 100;
            this._operation = [result];
        } else {

            this._operation = [result];
            if (last) this._operation.push(last);

        }
        this.setLastNumberToDisplay();
    }

    pushOperation(value) {
        this._operation.push(value);
        if (this._operation.length > 3) {
            this.calc();
        }
    }

    getLastItem(isOperator = true) {
        let lastItem;
        for (let i = this._operation.length - 1; i >= 0; i--)
            if (this.isOperator(this._operation[i]) == isOperator) {
                lastItem = this._operation[i];
                break;
            }

        if (!lastItem)
            lastItem = (isOperator) ? this._lastOperator : this._lastNumber;

        return lastItem;
    }

    setLastNumberToDisplay() {

        let lastNumber = this.getLastItem(false);

        if (!lastNumber) lastNumber = 0;
        this.displayCalc = lastNumber;

    }

    addOperation(value) {
        if (isNaN(this.getLastOperation())) //verifica se a ultima operacao não é um numero
            if (this.isOperator(value)) //se não for ele verifica se a operação é um operador
                this.setLastOperation(value); //se for um operador ela troca o operador

            else { //caso a ultima operação for undefined, neste caso para o primeiro numero é adicionado o proprio valor
                this.pushOperation(value);
                this.setLastNumberToDisplay();
            }
        else
            if (this.isOperator(value)) //caso a ultima operação seja um numero e for um operador adiciona o operador
                this.pushOperation(value);
            else { //se não
                let newValue = this.getLastOperation().toString() + value.toString(); //transforma o numero em string e concatena com o valor
                this.setLastOperation(newValue); //adiciona o novo valor
                this.setLastNumberToDisplay();
            }
    }

    addDot() {

        let lastOperation = this.getLastOperation();

        if (typeof lastOperation == "string" && lastOperation.split("").indexOf(".") > -1)
            return 0;

        if (this.isOperator(lastOperation) || !lastOperation) {
            this.pushOperation("0.");
        } else {

            this.setLastOperation(lastOperation.toString() + ".");
        }

        this.setLastNumberToDisplay();

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
                this.calc();
                break;
            case "ponto":
                this.addDot();
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