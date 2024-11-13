class Sudoku {
    constructor() {
        this.content = Array(81).fill(0);
        this.availables = Array(81).fill(9);
    }

    // Función toString
    toString() {
        let result = '';
        for (let i = 0; i < 9; i++) {
            result += this.content.slice(i * 9, (i + 1) * 9).join(' ') + '\n';
        }
        return result;
    }

    // Funciones básicas para añadir / borrar elementos.
    add(pos, number) {
        if (pos >= 81 || pos < 0) {
            throw new TypeError(`Invalid position: ${pos}`);
        }
        if (number <= 0 || number > 9) {
            throw new TypeError(`Invalid number: ${number}`);
        }
        

        this.content[pos] = number;
        this.updateAvailableNumbers();
    }

    remove(pos) {
        if (pos >= 81 || pos < 0) {
            throw new TypeError(`Invalid position: ${pos}`);
        }
        this.content[pos] = 0;
        this.updateAvailableNumbers();
    }

    clear() {
        this.content = Array(81).fill(0);
    }

    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    isComplete() {
        return this.content.every(value => value !== 0);
    }

    isComplete_Matrix() {
        let success = true; 
        for (let i = 0; i < this.content.length; i++) {
            success = this.content[i].every(value => value !== 0);
            if (success === false) {
                return;
            }
        }
        return success;
    }
    convertToMatrix() {
        const matrix = [];
        for (let i = 0; i < this.content.length; i += 9) {
            const row = this.content.slice(i, i + 9);
            matrix.push(row);
        }
        this.content = [...matrix];
    }

    // Funciones necesarias para ubicar números y actualizar los disponibles.
    getCurrentRow(pos) {
        return Math.floor(pos / 9);
    }

    getCurrentColumn(pos) {
        return pos % 9;
    }

    getFullRow(row) {
        return this.content.slice(row * 9, row * 9 + 9);
    }

    getFullColumn(column) {
        let columnValues = [];
        for (let i = 0; i < 9; i++) {
            columnValues.push(this.content[column + 9 * i]);
        }
        return columnValues;
    }

    getCurrentSquare(pos) {
        const row = this.getCurrentRow(pos);
        const col = this.getCurrentColumn(pos);
        const square = [Math.floor(row / 3), Math.floor(col / 3)];
        return square;
    }

    getFullSquare(square) {
        const fullSquare = [];
        const startRow = square[0] * 3;
        const startCol = square[1] * 3;

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const pos = (startRow + i) * 9 + (startCol + j);
                fullSquare.push(this.content[pos]);
            }
        }
        return fullSquare;
    }

    getAvailableNumbers(pos) {
        const row = this.getFullRow(this.getCurrentRow(pos));
        const col = this.getFullColumn(this.getCurrentColumn(pos));
        const square = this.getFullSquare(this.getCurrentSquare(pos));

        const setRow = new Set(row);
        const setCol = new Set(col);
        const setSquare = new Set(square);

        const notAvailables = new Set([...setRow, ...setCol, ...setSquare]);
        const numbers = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        const availables = new Set([...numbers].filter(num => !notAvailables.has(num)));

        return [...availables];
    }

    updateAvailableNumbers() {
        for (let i = 0; i < this.availables.length; i++) {
            if (this.content[i] === 0) {
                this.availables[i] = this.getAvailableNumbers(i).length;
            } else {
                this.availables[i] = 0;
            }
        }
    }

    getMinAvailablePos() {
        let min = 10;
        let pos = -1;

        for (let i = 0; i < this.availables.length; i++) {
            if (this.availables[i] < min && this.content[i] == 0) {
                min = this.availables[i];
                pos = i;
            }
        }

        return pos;
    }

    testUniqueness(current) {
        let firstSolution = new Sudoku();
        firstSolution.content = [...current];
        firstSolution.createRecursive(false);

        for (let i = 0; i < 10; i++) {
            let sol = new Sudoku();
            sol.content = Array.from(current);
            sol.createRecursive(false);
            if (!this.arraysEqual(sol.content, firstSolution.content)) {
                return false; // Si la encuentra, no es único.
            }
        }
        return true; // Si no encuentra una solución diferente en 10 intentos, se entiende que es único.
    }

    arraysEqual(arr1, arr2) {
        if (arr1.length !== arr2.length) return false;
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) return false;
        }
        return true;
    }

    createRecursive(clear=true) {
        if (clear) {
            this.clear();
        }

        let minPos = this.getMinAvailablePos();
        return this._createRecursive(minPos);
    }

    _createRecursive(pos) {
        // Caso base
        if (pos === -1 || this.content[pos] !== 0) {
            return this.content;
        }

        // Caso Recursivo
        let availableNumbers = this.getAvailableNumbers(pos);
        this.shuffle(availableNumbers);

        for (var number of availableNumbers) {
            this.add(pos, number);
            let minPos = this.getMinAvailablePos();

            if (minPos === -1 || this.isComplete()) {
                break;
            }

            this._createRecursive(minPos);

            if (this.isComplete()) {
                return this.content;
            }
            this.remove(pos);
        }
    }

    createPlayable(difficulty = 2) {
        if (![1, 2, 3].includes(difficulty)) {
            throw new Error(`Invalid difficulty: ${difficulty}. Must be in [1, 2, 3]`);
        }

        let numbersToLeave;
        if (difficulty === 3) {
            numbersToLeave = Math.floor(Math.random() * (28 - 24 + 1)) + 24; // Entre 24 y 28
        } else if (difficulty === 2) {
            numbersToLeave = Math.floor(Math.random() * (33 - 29 + 1)) + 29; // Entre 29 y 33
        } else {
            numbersToLeave = Math.floor(Math.random() * (38 - 34 + 1)) + 34; // Entre 34 y 38
        }

        const n = 81 - numbersToLeave;

        this.createRecursive();
        this.updateAvailableNumbers();
        this._createPlayable(n);

        return this.content;
    }

    _createPlayable(n, visited = []) {
        if (n <= 0 || visited.length >= 81) {
            return;
        }

        let position = Math.floor(Math.random() * 81);

        if (visited.includes(position)) {
            this._createPlayable(n, visited);
            return;
        }

        visited.push(position);

        let number = this.content[position];
        this.remove(position);

        let isUnique = this.testUniqueness(this.content);

        if (!isUnique) {
            this.add(position, number);
        } else {
            n -= 1;
        }

        this._createPlayable(n, visited);
    }
}

export default Sudoku;

// function main() {
//     let sudoku1 = new Sudoku();
//     sudoku1.createPlayable();
//     console.log(sudoku1.toString());
//     console.log(sudoku1.getFullSquare(sudoku1.getCurrentSquare(0)));
// }

// main();
