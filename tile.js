 export class Tile { // создание  плиточки
     // создаем constructor в аргументах (gridElement)
     constructor(gridElement) { // чтобы мы могли добавить плиточку во внутрь div#game-board
         this.tileElement = document.createElement("div") // создаем пустой div и сохраняем его в tileElement
         this.tileElement.classList.add("tile") // добавление класса "tile" для div_tileElement
         // при создании плиточки должно быть рандомное значение 2 или 4
         this.setValue(Math.random() > 0.5 ? 2 : 4); // Math.random() - возвращяеет случайное число от 0 до 1
         // в нашем случае когда Math.random() меньше 0.5 то значение плиты будет 2 в остальных случаях значение будет 4
         this.tileElement.textContent = this.value; // полученное значение добавляем тексом внутрь div_tileElement
         gridElement.append(this.tileElement) // добавляем созданный div_tileElement внутрь div#game-board
     }

     // метод setXY
     setXY(x, y){
         this.x = x; // будет менять значение Х & У внутри плисточки на новые
         this.y = y;
         this.tileElement.style.setProperty("--x", x); // а так же менять занчения --x & --у в CSS стилях
         this.tileElement.style.setProperty("--y", y);
     }
     // меняем цвет плиточки в зависимости от значеиня
     setValue(value){
         this.value = value;
         this.tileElement.textContent = this.value;
         const bgLightness = 100 - Math.log2(value) * 9; // 2 -> 100 - 1*9 -> 91; 2048 -> 100 - 11*91 -> 1;
         this.tileElement.style.setProperty("--bg-lightness", `${bgLightness}%`)
         this.tileElement.style.setProperty("--text-lightness", `${bgLightness < 50 ? 90 : 10}%`)
     }

     removeFromDOM(){
         this.tileElement.remove()
     }

     waitForTransitionEnd(){
         return new Promise(resolve => {
             this.tileElement.addEventListener("transitionend", resolve, {once: true})
         })
     }

     waitForAnimationEnd(){
         return new Promise(resolve => {
             this.tileElement.addEventListener("animationend", resolve, {once: true})
         })
     }

 }