// Верстка с помощью JS
import {Cell} from "./cell.js"; // добавляем созданный класс


const GRID_SIZE = 4;
const CELL_COUNT = GRID_SIZE * GRID_SIZE;

// Объявили класс Grid
// создали constructor внутри этого класса который в прраметрах принемает gridElement
// constructor вызывается один раз в момент создания екземпляра класса
// Внутри  constructor мы создадим 16 ячеек и сохраним их в массив Sells
// Для этого объявим объект класса Sells и сперва зададим ему значение равное пустому массиву
// А затем с помощью цикла for заполним этот массив

// После создания констант добавляем CELL_COUNT в икл for и на каждой итерации будем добавлять ноую ячейку методом PUSH
// Новая ячейка - это экземпляр класса CELL
// Класс CELL в качестве аргрумента будет принимать (gridElement, x, y)
// gridElement - нужен для того чтобы мы могли добавлять ячеку в div.gameBoard
// x; y; для положения ячейки
export class Grid {
    constructor(gridElement) {
        this.cells = [];
        for (let i = 0; i < CELL_COUNT; i++) {
            this.cells.push(
                new Cell(gridElement, i % GRID_SIZE, Math.floor(i / GRID_SIZE)) // Теперь при объявлении экземпляра "класса CELL " нужно корректно указать х & у
                // вместо х пишем i % GRID_SIZE - тоесть мы будем брать остаток от деления i на 4
                // в итоге x будет меняться от 0 до 3 и так 4 раза
                // вместо у пишем Math.floor(i / GRID_SIZE) - тоесть мы будем брать целую часть от деления i на 4
                // в итоге у будет меняться от 0 до 3 но первые 4 елемента получат у = 0 следующие 4 елементта у = 1 и т.д.

            )

        }
        // свойство
        this.cellsGroupedByColumn = this.groupCellsByColumn();
        this.cellsGroupedByReversedColumn = this.groupCellsByColumn().map(column => [...column].reverse())
        this.cellsGroupedByRow = this.groupCellsByRow();
        this.cellsGroupedByReverseRow = this.groupCellsByRow().map(row => [...row].reverse())
    }

// описывание метода getRandomEmptyCell внутри него мы будем искать все пустые ячейки
    getRandomEmptyCell() {
        const emptyCells = this.cells.filter(cell => cell.isEmpty()) // фильтруем все ячейки и сохраним только пустые ячейки
        const randomIndex = Math.floor(Math.random() * emptyCells.length) // достаем случайную ячейку среди всех пустых ячеек
        // Math.random умножаем на длинну массива и бетем целую часть,
        // так как Math.random возврощает случайное число от 0 до 1 не включая еденицу
        // то при умножени на длинну массива получим число от 0 до длинны массива не включая число равное длинне массива - это случайный индекс
        return emptyCells[randomIndex] // возвращяем случайную пустую ячейку в конце метода
    }

    // нам нужно сгруппировать ячейки в новый массив
    groupCellsByColumn() { // для этого нужен метод reduce по 16 ячейкам  тогда мы получим новый массив и оставим нетронутыми наши ячейки
        // метод reduce в качестве аргументов принимвет функцию где мы будем писать группировку и начальный эльемент в нашем случае пустой массив
        return this.cells.reduce((groupCells, cell) => { // у функции будет два параметра groupCells - аккамулятор метода reduce
            // groupCells - будет храниться значение которое мы возвращяем из внутренней функции на каждой итерации
            groupCells[cell.x] = groupCells[cell.x] || []
            groupCells[cell.x][cell.y] = cell
            return groupCells
        }, [])
    }
    groupCellsByRow() {
        return this.cells.reduce((groupCells, cell) => {
            groupCells[cell.y] = groupCells[cell.y] || []
            groupCells[cell.y][cell.x] = cell
            return groupCells
        }, [])
    }



}
