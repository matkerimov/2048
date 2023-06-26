import {Grid} from "./grid.js";
import {Tile} from "./tile.js";

const gameBoard = document.getElementById("game-board");

const grid = new Grid(gameBoard); //  grid -  это класс который будет хранить в себе все ячейки
// Добавляем плиточку с цифрой
grid.getRandomEmptyCell().linkTile(new Tile(gameBoard))
grid.getRandomEmptyCell().linkTile(new Tile(gameBoard))
// getRandomEmptyCell() - получение случайной свободной ячейки
// linkTile - привязка к ячейке плиточки
// new Tile - создание плиточки
setUpInputOnce();

let hammerTime = new Hammer(gameBoard);
// hammerTime.on('pan', function(ev) {
//     console.log(ev);
//     hammerTime.get('pan').set({ direction: Hammer.DIRECTION_ALL });
    hammerTime.get('swipe').set({ direction: Hammer.DIRECTION_ALL });



function setUpInputOnce() { // тут мы подписались нажатие клавиши тоько один раз
    window.addEventListener("keydown", handleInput, {once: true}) // после нажатии клавиши будет вызвана функция handleInput
}

async function handleInput(event) {
    switch (event.key) {
        case "ArrowUp":
            if (!canMoveUp()) {
                setUpInputOnce();
                return;
            }
            await moveUp();
            break;

        case "ArrowDown":
            if (!canMoveDown()){
                setUpInputOnce()
                return
            }
            await moveDown();
            break;

        case "ArrowLeft":
            if (!canMoveLeft()){
                setUpInputOnce()
                return
            }
            await moveLeft()
            break;

        case "ArrowRight":
            if (!canMoveRight()){
                setUpInputOnce()
                return
            }
            await moveRight()
            break;

        default:
            setUpInputOnce() // добавляем чтобы снова подписаться на нажатие новой клавиши
            return; // его пишем так как мы не должны ни как реагировать на нажатия других клавиш
    }

    const newTile = new Tile(gameBoard)
    grid.getRandomEmptyCell().linkTile(newTile)

    if  (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()){
        await   newTile.waitForAnimationEnd()
        alert("Ойун бутту!")
        return
    }
    setUpInputOnce()
}

// в этой функции мы будем сдвигать плиточки
// a сдвигать будем по сгруппированным колонкам ячейками
async function moveUp() {
    await slideTiles(grid.cellsGroupedByColumn)
}

async function moveDown() {
    await slideTiles(grid.cellsGroupedByReversedColumn)
}

async function moveLeft() {
    await slideTiles(grid.cellsGroupedByRow)
}

async function moveRight() {
    await slideTiles(grid.cellsGroupedByReverseRow)
}

// Идея сдвига мы сперва сгруппирцем 16 ячеек по столбцам В итоге у нас получится массив из 4 столбцов а каждый столбец это массив из 4 ячеек
// После этого мы пробежимся по всем столбцам и в каждом столбце сдвинем привязанные к ячейкам плиточки вверх

async function slideTiles(groupedCells) {
    const promises = []
    // с помощью метода forEach пробежимся по сгруппированным ячейкам и для каждой группы вызовим slideTilesInGroup вызовится 4 раза
    groupedCells.forEach(group => slideTilesInGroup(group, promises))

    await Promise.all(promises)

    grid.cells.forEach(cell => {
        cell.hasTileForMerge() && cell.mergeTiles()
    })
}

function slideTilesInGroup(group, promises) { // будет принемать сгруппированные столбцы ячейки
    // далее с помощью цикла for пробежимся по ячейкам в стольбце но самую верхнюю ячейку учитывать не будем так как ее не куда выше поднимать
    for (let i = 1; i < group.length; i++) {
        // смещять мы будем только плиточки поэтому сперва проверяем ячейку на пустоту
        if (group[i].isEmpty()) {
            continue; // если ячейка группы T пустая то прерываем текущую итерацию цикла и переходим к следующей итерации
        }
        const cellWithTile = group[i] // запишем ячейку группы T так как прошли проверку на пустую ячейку
        let targetCell;
        let j = i - 1
        while (j >= 0 && group[j].canAccept(cellWithTile.linkedTile)) {
            targetCell = group[j];
            j--;
        }
        if (!targetCell) {
            continue;
        }

        promises.push(cellWithTile.linkedTile.waitForTransitionEnd())

        if (targetCell.isEmpty()) {
            targetCell.linkTile(cellWithTile.linkedTile)
        } else {
            targetCell.linkTileForMerge(cellWithTile.linkedTile)
        }

        cellWithTile.unlinkTile()
    }

}

function canMoveUp() {
    return canMove(grid.cellsGroupedByColumn)
}
function canMoveDown() {
    return canMove(grid.cellsGroupedByReversedColumn)
}
function canMoveLeft() {
    return canMove(grid.cellsGroupedByRow)
}
function canMoveRight() {
    return canMove(grid.cellsGroupedByReverseRow)
}

function canMove(groupedCells) {
    return groupedCells.some(group => canMoveInGroup(group))
}

function canMoveInGroup(group) {
    return group.some((cell, index) => {
        if (index === 0) {
            return false
        }
        if (cell.isEmpty()) {
            return false
        }

        const targetCell = group[index - 1]
        return targetCell.canAccept(cell.linkedTile)
    })
}