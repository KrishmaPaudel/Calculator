
class Calculator {
    constructor(historyExprEl, currentValueEl, historyListEl) {
        this.historyExprEl = historyExprEl;
        this.currentValueEl = currentValueEl;
        this.historyListEl = historyListEl;
        this.history = [];

        this.reset();
    }

    reset() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.shouldResetDisplay = false;

        this.updateDisplay();
    }

    delete() {
        if (this.shouldResetDisplay) return;
        if (this.currentOperand === '0') return;

        if (this.currentOperand.length === 1) {
            this.currentOperand = '0';
        } else {
            this.currentOperand = this.currentOperand.slice(0, -1);
        }

        this.updateDisplay();
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;

        if (
            (this.currentOperand === '0' && number !== '.') ||
            this.shouldResetDisplay
        ) {
            this.currentOperand = number;
            this.shouldResetDisplay = false;
        } else {
            this.currentOperand += number;
        }

        this.updateDisplay();
    }

    chooseOperation(op) {
        if (this.currentOperand === '' && op !== '-') return;

        if (this.previousOperand !== '') {
            this.compute();
        }

        this.operation = op;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '0';

        this.updateDisplay();
    }

    compute() {
        let computation;

        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);

        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;

            case '−':
            case '-':
                computation = prev - current;
                break;

            case '×':
            case '*':
                computation = prev * current;
                break;

            case '÷':
            case '/':
                if (current === 0) {
                    alert("Cannot divide by zero");
                    this.reset();
                    return;
                }

                computation = prev / current;
                break;

            case '%':
                computation = prev % current;
                break;

            default:
                return;
        }

        const expressionString = `${prev} ${this.getSymbol(this.operation)} ${current}`;

        this.addHistory(expressionString, computation);

        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
        this.shouldResetDisplay = true;

        this.updateDisplay();
    }

    percent() {
        const current = parseFloat(this.currentOperand);

        if (isNaN(current)) return;

        const result = current / 100;

        this.addHistory(`${current}%`, result);

        this.currentOperand = result.toString();
        this.shouldResetDisplay = true;

        this.updateDisplay();
    }

    getSymbol(op) {
        switch (op) {
            case '+':
                return '+';

            case '-':
            case '−':
                return '−';

            case '*':
            case '×':
                return '×';

            case '/':
            case '÷':
                return '÷';

            default:
                return op;
        }
    }

    addHistory(expr, res) {
        this.history.unshift({ expr, res });

        this.renderHistory();
    }

    renderHistory() {
        if (this.history.length === 0) {
            this.historyListEl.innerHTML = '<li class="empty-msg">No history yet</li>';
            return;
        }

        this.historyListEl.innerHTML = this.history.map((item, index) => `
            <li class="history-item" data-index="${index}">
                <div class="expr">${item.expr} =</div>
                <div class="res">${item.res}</div>
            </li>
        `).join('');

        this.historyListEl.querySelectorAll('.history-item').forEach(el => {
            el.addEventListener('click', () => {
                const idx = el.getAttribute('data-index');

                this.currentOperand = this.history[idx].res.toString();

                this.updateDisplay();
            });
        });
    }

    clearHistory() {
        this.history = [];

        this.renderHistory();
    }

    updateDisplay() {
        this.currentValueEl.innerText = this.currentOperand;

        if (this.operation != null) {
            this.historyExprEl.innerText =
                `${this.previousOperand} ${this.getSymbol(this.operation)}`;
        } else {
            this.historyExprEl.innerText = '';
        }
    }
}


document.addEventListener('DOMContentLoaded', () => {

    const calc = new Calculator(
        document.getElementById('history-expression'),
        document.getElementById('current-value'),
        document.getElementById('history-list')
    );

    document.querySelector('.keypad-grid').addEventListener('click', (e) => {

        const target = e.target;

        if (!target.classList.contains('btn')) return;

        const val = target.getAttribute('data-val');
        const action = target.getAttribute('data-action');

        if (val !== null) {
            calc.appendNumber(val);

        } else if (action !== null) {

            switch (action) {
                case 'clear':
                    calc.reset();
                    break;

                case 'delete':
                    calc.delete();
                    break;

                case 'add':
                    calc.chooseOperation('+');
                    break;

                case 'subtract':
                    calc.chooseOperation('−');
                    break;

                case 'multiply':
                    calc.chooseOperation('×');
                    break;

                case 'divide':
                    calc.chooseOperation('÷');
                    break;

                case 'calculate':
                    calc.compute();
                    break;

                case 'percent':
                    calc.percent();
                    break;
            }
        }
    });


    window.addEventListener('keydown', (e) => {

        if ((e.key >= '0' && e.key <= '9') || e.key === '.') {
            calc.appendNumber(e.key);

        } else if (
            e.key === '+' ||
            e.key === '-' ||
            e.key === '*' ||
            e.key === '/'
        ) {
            calc.chooseOperation(e.key);

        } else if (e.key === 'Enter' || e.key === '=') {
            e.preventDefault();
            calc.compute();

        } else if (e.key === 'Backspace') {
            calc.delete();

        } else if (e.key === 'Escape') {
            calc.reset();
        }
    });


    document.getElementById('toggle-history').addEventListener('click', () => {
        document.getElementById('history-panel').classList.toggle('hidden');
    });


    document.getElementById('clear-history').addEventListener('click', () => {
        calc.clearHistory();
    });


    document.getElementById('toggle-theme').addEventListener('click', () => {
        document.body.classList.toggle('light-mode');

        const themeButton = document.getElementById('toggle-theme');

        if (document.body.classList.contains('light-mode')) {
            themeButton.innerText = '🌙';
        } else {
            themeButton.innerText = '☀️';
        }
    });

});
