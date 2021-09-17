function choose(choices) {
  let index = Math.floor(Math.random() * choices.length);
  return choices[index];
}

const game = {
    posX: 0,
    posY: 0,
    enemies: [],
	enemiesNumber: 4,
    bombs: 1,
    fireRange: 1,
    bootsItem: false,
    health: 3,
    width: 11,
    height: 11,

    initGame : function(){
        this.drawBoard();
        this.initKeyboardEvents();
        this.stats()
    },
    stats : function(){
        document.querySelector(".lives-info").innerHTML = this.health
        document.querySelector(".bombs-info").innerHTML = this.bombs
        document.querySelector(".fire-info").innerHTML = this.fireRange
        if(this.bootsItem){
            document.querySelector(".vodka-info").innerHTML = "Naj***łeś się<br>Możesz chodzić po bombach"
        }
        document.querySelector(".enemy-info").innerHTML = this.enemiesNumber
    },

    drawBoard: function () {
        const rows = this.height;
        const cols = this.width;
		let counter = 0;
        let gameField = document.querySelector(".game-field");
        for (let row = 0; row < rows; row++) {
            let cellIndex = 0
            const rowElement = this.addRow(gameField);
            for (let col = 0; col < cols; col++) {
                if (col === 0 && row === 0){
                    this.addPlayer(rowElement, row, col)
                }
                else if (col === 6 && row === 5){
                    this.addEnemy(rowElement, row, col)
                }
                else if (col === 6 && row === 7){
                    this.addEnemy(rowElement, row, col)
                }
                else if (col === 4 && row === 7){
                    this.addEnemy(rowElement, row, col)
                }
                else if (col === 4 && row === 5){
                    this.addEnemy(rowElement, row, col)
                }
                else {
					if(col%2 !== 0 && row%2 !== 0)
					{
						this.addObstacles(rowElement, row, col);
						cellIndex++;
					}
					else if(Math.floor(Math.random() * 10)<5 && ((row > 1 && col <= 1) || (row <= 1 && col > 1) || (row > 1 && col > 1)))
					{
						if(Math.floor(Math.random() * 10)>5 && counter == 0){
							this.addExit(rowElement, row, col)
							counter++;
							cellIndex++;}
						else{
							this.addBoxes(rowElement, row, col);
							cellIndex++;}
					}
					else
					{
						this.addCell(rowElement, row, col);
						cellIndex++;
					}
                }
            }
        }
    },
	exitDoors :function()
	{
		if(game.enemiesNumber == 0){
			 var element = document.getElementById('close');
			 element.id = 'open';
		}
	},
    addRow: function (gameField) {
        gameField.insertAdjacentHTML(
            'beforeend',
            '<div class="row"></div>'
        );
        return gameField.lastElementChild;
    },
    addCell: function (rowElement, row, col) {
        rowElement.insertAdjacentHTML(
            'beforeend',
            `<div class="field"
                    data-row="${row}"
                    data-col="${col}"></div>`);
    },
	addObstacles: function (rowElement, row, col) {
        rowElement.insertAdjacentHTML(
            'beforeend',
            `<div class="field wall"
                        data-row="${row}"
                        data-col="${col}"></div>`);
    },
	addExit: function (rowElement, row, col) {
        rowElement.insertAdjacentHTML(
            'beforeend',
            `<div id ='close' class="field"
                        data-row="${row}"
                        data-col="${col}"></div>`);
	},
	addBoxes: function (rowElement, row, col) {
        rowElement.insertAdjacentHTML(
            'beforeend',
            `<div class="field box"
                        data-row="${row}"
                        data-col="${col}"></div>`);
    },

    addPlayer: function (rowElement, row, col) {
        rowElement.insertAdjacentHTML(
            'beforeend',
            `<div class="field player"
                        data-row="${row}"
                        data-col="${col}"></div>`);
    },

    addEnemy: function (rowElement, row, col) {
        let id = game.enemies.length
        rowElement.insertAdjacentHTML(
            'beforeend',
            `<div class="field enemy"
                        data-row="${row}"
                        data-col="${col}"
                        data-id="${id}"></div>`);

        game.enemies.push(setInterval(function (){
            let rowAndCol = game.move(col, row)
            col = rowAndCol[0]
            row = rowAndCol[1]
        }, 500))
    },

    spawnItems: function (row, col){
        let chance = Math.floor(Math.random() * 100);
        if (chance < 30){
            let choices = ["bomb-item", "fire-item", "vodka-item"]
            if (game.bootsItem){
                choices.pop()
            }
            let choice = choose(choices)
            document.querySelector(".game-field").children[row].children[col].classList.add(choice)
        }
    },

    burn: function (row, col){

        if (document.querySelector(".game-field").children[row].children[col].classList.contains("wall")){
            return false
        }
        if (document.querySelector(".game-field").children[row].children[col].classList.contains("box")){
            document.querySelector(".game-field").children[row].children[col].classList.remove("box")
            document.querySelector(".game-field").children[row].children[col].classList.add("fire")
            game.spawnItems(row, col)
            return false
        }
        if (document.querySelector(".game-field").children[row].children[col].classList.contains("enemy")){
            let dostalem = new Audio("static/sounds/bartek_dostalem.mp3");
            dostalem.play()
			game.enemiesNumber--;
            this.stats();
			game.exitDoors();
            document.querySelector(".game-field").children[row].children[col].classList.remove("enemy");
            let id = document.querySelector(".game-field").children[row].children[col].getAttribute("data-id");
            document.querySelector(".game-field").children[row].children[col].setAttribute("data-id", "");
            clearInterval(game.enemies[id])
        }
        if (document.querySelector(".game-field").children[row].children[col].classList.contains("player")){
            this.getHit()
        }
        if (document.querySelector(".game-field").children[row].children[col].classList.contains("bomb-item")){
            document.querySelector(".game-field").children[row].children[col].classList.remove("bomb-item")
        }
        if (document.querySelector(".game-field").children[row].children[col].classList.contains("fire-item")){
            document.querySelector(".game-field").children[row].children[col].classList.remove("fire-item")
            let ogien = new Audio("static/sounds/wez_koc.mp3");
            ogien.play()
        }
        if (document.querySelector(".game-field").children[row].children[col].classList.contains("vodka-item")){
            document.querySelector(".game-field").children[row].children[col].classList.remove("vodka-item")
        }
        document.querySelector(".game-field").children[row].children[col].classList.add("fire")
        return true
    },


     addBomb: function (rowElement, row, col, length) {
        rowElement.classList.add("bomb")
        rowElement.classList.add("bomb-1-stage")
        const explosion = setInterval(function(){
            const bomb1stage = setInterval(function(){
                document.querySelector(".game-field").children[row].children[col].classList.remove("bomb-1-stage")
                document.querySelector(".game-field").children[row].children[col].classList.add("bomb-2-stage")
                const bomb2stage = setInterval(function(){
                    document.querySelector(".game-field").children[row].children[col].classList.remove("bomb-2-stage")
                    document.querySelector(".game-field").children[row].children[col].classList.add("bomb-3-stage")
                    const bomb3stage = setInterval(function(){
                        document.querySelector(".game-field").children[row].children[col].classList.remove("bomb-3-stage")
                        document.querySelector(".game-field").children[row].children[col].classList.add("bomb-last-stage")
                        const fire = setInterval(function(){
                            document.querySelector(".game-field").children[row].children[col].classList.remove("bomb-last-stage")
                            let boom = new Audio("static/sounds/boom.mp3");
                            boom.volume = 0.4;
                            boom.play()
                            game.burn(row, col)
                            document.querySelector(".game-field").children[row].children[col].classList.remove("bomb-last-stage")
                            game.bombs++
                            game.stats()
                            let flag1 = true
                            let flag2 = true
                            let flag3 = true
                            let flag4 = true
                            for(let i=1; i<length+1; i++)
                            {
                                if(row+i <game.height && flag1){
                                    flag1 = game.burn(row + i, col)
                                }
                                if(row-i >=0 && flag2){
                                    flag2 = game.burn(row - i, col)
                                }
                                if(col+i <game.width && flag3){
                                    flag3 = game.burn(row, col + i)
                                }
                                if(col-i >=0 && flag4){
                                    flag4 = game.burn(row, col - i)
                                }
                            }
                            document.querySelector(".game-field").children[row].children[col].classList.remove("bomb")
                            const finishFire = setInterval(function() {
                                document.querySelector(".game-field").children[row].children[col].classList.remove("fire")
                                for(let i=1; i<length+1; i++) {
                                    if(row+i <game.height){
                                    document.querySelector(".game-field").children[row + i].children[col].classList.remove("fire")
                                    }
                                    if(row-i >=0){
                                    document.querySelector(".game-field").children[row - i].children[col].classList.remove("fire")
                                    }
                                    if(col+i <game.width){
                                    document.querySelector(".game-field").children[row].children[col + i].classList.remove("fire")
                                    }
                                    if(col-i >=0){
                                    document.querySelector(".game-field").children[row].children[col - i].classList.remove("fire")
                                    }
                                }
                            clearInterval(finishFire)},1000)
                        clearInterval(fire)},1000)
                     clearInterval(bomb3stage)},1000)
                 clearInterval(bomb2stage)},1000)
             clearInterval(bomb1stage)},1000)
         clearInterval(explosion)},1000)
    },



    getHit(){
        game.health--
        this.stats()
        if (game.health === 0){
            let finito = new Audio("static/sounds/adesso_finito.mp3");
            finito.play()
            window.location.href = "/end2"
        }
        else {
            let oof = new Audio("static/sounds/classic_hurt.mp3");
            oof.play()
        }
    },

    go: function (row, col, changeRow, changeUp) {
        let success = true
        let target
        if (changeRow && changeUp && row !== this.height -1 ) {
            target = document.querySelector(".game-field").children[row + 1].children[col].classList;
        } else if (changeRow && !changeUp && row !== 0) {
            target = document.querySelector(".game-field").children[row - 1].children[col].classList;
        } else if (!changeRow && changeUp && col !== this.width - 1) {
            target = document.querySelector(".game-field").children[row].children[col + 1].classList;
        } else if (!changeRow && !changeUp && col !== 0) {
            target = document.querySelector(".game-field").children[row].children[col - 1].classList;
        } else {
            success = false
        }
        if (success) {
            if (target.contains('wall')) {
                return  false
            } else if (target.contains("enemy")) {
                return false
            } else if (target.contains("bomb")) {
                return false
            } else if (target.contains("box")) {
                return false
            } else if (target.contains("fire")) {
                return false
            } else if (target.contains("player")) {
                game.getHit();
            } else if (target.contains("bomb-item")) {
                target.remove("bomb-item")
            }else {
                document.querySelector(".game-field").children[row].children[col].classList.remove("enemy");
                let temp = document.querySelector(".game-field").children[row].children[col].getAttribute("data-id");
                document.querySelector(".game-field").children[row].children[col].setAttribute("data-id", "")

                if (changeRow && changeUp) {
                    row++;
                } else if (changeRow && !changeUp) {
                    row--;
                } else if (!changeRow && changeUp) {
                    col++;
                } else if (!changeRow && !changeUp) {
                    col--;
                }
                document.querySelector(".game-field").children[row].children[col].classList.add("enemy");
                document.querySelector(".game-field").children[row].children[col].setAttribute("data-id", temp)
                if (document.querySelector(".game-field").children[row].children[col].classList.contains("vodka-item")){
                    document.querySelector(".game-field").children[row].children[col].classList.remove("vodka-item")
                    let mocna = new Audio("static/sounds/siedem_procent.mp3");
                    mocna.play()
                }
                if (document.querySelector(".game-field").children[row].children[col].classList.contains("fire-item")){
                    document.querySelector(".game-field").children[row].children[col].classList.remove("fire-item")
                    let mocna = new Audio("static/sounds/wiadro_benzyny.mp3");
                    mocna.play()
                }
                if (document.querySelector(".game-field").children[row].children[col].classList.contains("bomb-item")){
                    document.querySelector(".game-field").children[row].children[col].classList.remove("bomb-item")
                }
            }
            return [row, col]
        }
        else{
            return false
        }
    },

    move(col, row){
        let choices = [0,1,2,3]
        let success = false
        while (!success) {
            if (choices.length === 0){
                break
            }
            success = true
            let rng = choose(choices)
            const index = choices.indexOf(rng);
            if (index > -1) {
                choices.splice(index, 1);
            }
            let rowAndCol
            switch (rng) {
                case 0:
                    rowAndCol = game.go(row, col, true, false )
                    if (rowAndCol){
                        row = rowAndCol[0]
                        col = rowAndCol[1]
                    }
                    else {
                        success = false
                    }
                    break
                case 1:
                    rowAndCol = game.go(row, col, false, true )
                    if (rowAndCol){
                        row = rowAndCol[0]
                        col = rowAndCol[1]
                    }
                    else {
                        success = false
                    }
                    break
                case 2:
                    rowAndCol = game.go(row, col, false, false )
                    if (rowAndCol){
                        row = rowAndCol[0]
                        col = rowAndCol[1]
                    }
                    else {
                        success = false
                    }
                    break
                case 3:
                    rowAndCol = game.go(row, col, true, true )
                    if (rowAndCol){
                        row = rowAndCol[0]
                        col = rowAndCol[1]
                    }
                    else {
                        success = false
                    }
                    break
            }
        }
        return [col, row]
    },

    toggleMusic: function (currentMusic){
        let musicMrok = new Audio("static/sounds/music_mrok.mp3");
        let musicPodroz = new Audio("static/sounds/music_podroz.mp3");
        let musicKarabinki = new Audio("static/sounds/music_karabinki.mp3");
        if (currentMusic !== null){
            console.log("null")
            currentMusic.pause();
            currentMusic.currentTime = 0
            currentMusic = null
        }
        else {
            rng = Math.floor(Math.random() * 3);
            console.log(rng)
            switch (rng){
                case 0:
                    musicMrok.play()
                    currentMusic = musicMrok
                    break
                case 1:
                    musicPodroz.play()
                    currentMusic = musicPodroz
                    break
                case 2:
                    musicKarabinki.play()
                    currentMusic = musicKarabinki
                    break
            }
        }
        return currentMusic
    },

    movePlayer: function (modifyX, modifyUp) {
        let target;
        if (modifyX && modifyUp && game.posX !== this.height){
            target = document.querySelector(".game-field").children[game.posX + 1].children[game.posY]
        }
        else if (modifyX && !modifyUp && game.posX !== 0){
            target = document.querySelector(".game-field").children[game.posX - 1].children[game.posY]
        }
        else if (!modifyX && modifyUp && game.posY !== this.width){
            target = document.querySelector(".game-field").children[game.posX].children[game.posY + 1]
        }
        else if (!modifyX && !modifyUp && game.posY !== 0){
            target = document.querySelector(".game-field").children[game.posX].children[game.posY - 1]
        }
        else {
            return false
        }
        //  move preventing events:
        if (target.classList.contains("wall")) {
            return false
        } else if (target.className.includes("enemy")) {
            game.getHit();
            return false
        } else if (target.classList.contains("box")) {
            return false
        } else if (target.classList.contains("bomb") && !this.bootsItem) {
        return false
        }
        document.querySelector(".game-field").children[game.posX].children[game.posY].classList.remove("player")
        if (modifyX && modifyUp){
            game.posX++
        }
        else if (modifyX && !modifyUp){
            game.posX--
        }
        else if (!modifyX && modifyUp){
            game.posY++
        }
        else if (!modifyX && !modifyUp){
            game.posY--
        }
        // after move events
        if (target.classList.contains("bomb-item")){
            game.bombs++
            game.stats()
            let collect = new Audio("static/sounds/collect_bomb.mp3");
            collect.play()
            document.querySelector(".game-field").children[game.posX].children[game.posY].classList.remove("bomb-item")
        }
        else if (target.id === "open"){
            window.location.href = "/end"
        }
        else if (target.classList.contains("fire-item")){
            game.fireRange++
            this.stats()
            let collect = new Audio("static/sounds/collect_bomb.mp3");
            collect.play()
            document.querySelector(".game-field").children[game.posX].children[game.posY].classList.remove("fire-item")
        }
        else if (target.classList.contains("vodka-item")){
            game.bootsItem = true;
            this.stats()
            let collect = new Audio("static/sounds/collect_bomb.mp3");
            collect.play()
            document.querySelector(".game-field").children[game.posX].children[game.posY].classList.remove("vodka-item")
        }
        else if (target.classList.contains("fire")){
            this.getHit()
        }
        document.querySelector(".game-field").children[game.posX].children[game.posY].classList.add("player")
    },

    initKeyboardEvents() {
        let currentMusic = null
        document.addEventListener("keypress", function(event){
            switch (event.key.toLowerCase()) {
                case "w":
                    game.movePlayer(true, false)
                    break
                case "s":
                    game.movePlayer(true, true)
                    break
                case "a":
                    game.movePlayer(false, false)
					break
                case "d":
                    game.movePlayer(false,true)
					break
                case " ":
                    if (game.bombs !== 0) {
                        game.addBomb(document.querySelector(".game-field").children[game.posX].children[game.posY], game.posX, game.posY, game.fireRange)
                        let zGranata = new Audio("static/sounds/z_granata.mp3");
                        zGranata.play()
                        game.bombs--
                        game.stats()
                    }
                    break
                case "m":
                    currentMusic = game.toggleMusic(currentMusic)
                    break
            }
        });
       
    }
}

