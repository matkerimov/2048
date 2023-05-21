export class Cell {  // объявляем class Cell
    constructor(gridElement, x, y) { // создаем constructor который принимает в параметрах gridElement, x, y
        const cell = document.createElement("div"); // создали пустой div и сохранили в константу cell
        cell.classList.add("cell"); // с помощью classList добавляем div класс "cell"
        gridElement.append(cell); // добавлям в созданный div елемент div#game-board (из html)
        this.x = x;
        this.y = y;
        // сохраняем х & у  внутри класса
    }
    // метод linkTile который принимает в аргументах плиточку tile
    linkTile(tile){
        tile.setXY(this.x, this.y) // и так же метод будет останавливать координаты плитки с помщью метода setXY
        this.linkedTile = tile; // этот метод должен будет сохранять плиточку внутри ячейки this.linkTile
    }
    // метод будет перезаписывать ссылку на привязанную плиточку на null
    unlinkTile(){
        this.linkedTile = null
    }
    // метод isEmpty будет возвращать boolean значение в зависимости от того есть ли в ячейке привязанная плиточка или нет
    isEmpty() {
        return !this.linkedTile;
    }
    // метод будет менять координаты плиточки на новые с помошью setXY
    linkTileForMerge(tile){ // принимает в аргументах плиточку tile
        tile.setXY(this.x, this.y)
        this.linkedTileForMerge = tile// и будет сохранять ссылку на плиточку здесь
    }

    unlinkTileForMerge(){
        this.linkedTileForMerge = null
    }

    hasTileForMerge(){
        return !!this.linkedTileForMerge;

    }

    canAccept(newTile){
        return this.isEmpty() || (!this.hasTileForMerge() && this.linkedTile.value === newTile.value)
    }

    mergeTiles() {
        this.linkedTile.setValue(this.linkedTile.value + this.linkedTileForMerge.value)
        this.linkedTileForMerge.removeFromDOM()
        this.unlinkTileForMerge()
    }
}
