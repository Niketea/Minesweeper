class Spot{
    constructor(cell){
        this.element = cell;
        this.row = Number(cell.getAttribute("rowIndex"));
        this.column = Number(cell.getAttribute("columnIndex"));
        this.hasMine = cell.getAttribute("hasMine") == "true";
        this.adjacentMines = Number(cell.getAttribute("adjacentMines"));
        this.revealed = false;
    }

    makeGreen(){
        if((this.row + this.column) % 2 == 0){
            this.element.style.backgroundColor = "lightgreen";
        }else{
            this.element.style.backgroundColor = "darkgreen";
        }
    }

    makeTan(){
        if((this.row + this.column) % 2 == 0){
            this.element.style.backgroundColor = "tan";
        }else{
            this.element.style.backgroundColor = "wheat";
        }
    }

    makeBomb(){
        this.element.style.backgroundColor = "red";
    }

    reveal(){
        if(this.hasMine){
            this.makeBomb();
            endGame();
        }else{
        
            this.makeTan();
            this.revealed = true;
            this.element.innerHTML = "";

            if(this.adjacentMines == 0){
                let topRow = this.row == 0;
                let bottomRow = this.row == 19;
                let leftColumn = this.column == 0;
                let rightColumn = this.column == 19;
                
                if (!topRow && !leftColumn && !cells[this.row - 1][this.column - 1].revealed)
                    cells[this.row - 1][this.column - 1].reveal();
                if(!topRow && !cells[this.row-1][this.column].revealed)
                    cells[this.row-1][this.column].reveal();
                if(!topRow && !rightColumn && !cells[this.row - 1][this.column + 1].revealed)
                    cells[this.row - 1][this.column + 1].reveal();
                if(!rightColumn && !cells[this.row][this.column+1].revealed)
                    cells[this.row][this.column+1].reveal();
                if(!bottomRow && !rightColumn && !cells[this.row + 1][this.column+1].revealed)
                    cells[this.row + 1][this.column+1].reveal();
                if(!bottomRow && !cells[this.row+1][this.column].revealed)
                    cells[this.row+1][this.column].reveal();
                if(!bottomRow && !leftColumn && !cells[this.row + 1][this.column - 1].revealed)
                    cells[this.row + 1][this.column - 1].reveal();
                if(!leftColumn && !cells[this.row][this.column-1].revealed)
                    cells[this.row][this.column-1].reveal();

            }else{
                this.displayMines();
            }
        }
    }

    mark(){
        if(!this.revealed){
            if(this.element.innerHTML == "X")
            {
                this.element.innerHTML = "";
                totalMines++;
            }else{
                this.element.innerHTML = "X";
                totalMines--; 
            }
            changeLabel();
        }
    }

    setAdjacentMines(mines){
        this.adjacentMines = mines;
    }

    displayMines(){
        this.element.innerHTML = this.adjacentMines;
    }
}


const totalMines = 50;
let cells = [];
let tempCells = document.querySelectorAll(".cell");
let label = document.querySelector("#label");

tempCells.forEach(cell => {
    if(cell.getAttribute("columnIndex") == 0){
        cells.push([]);
    }
    cells[cell.getAttribute("rowIndex")].push(new Spot(cell));
})

cells.forEach(row => row.forEach(spot => spot.makeGreen()));

function randomNumber(min,max)
{
    return Math.floor(Math.random() * (max-min+1)) + min;
}

function changeLabel(){
    label.innerHTML = "Mines: " + totalMines;
}

for(let i = 0; i < totalMines; i++)
{
    let newMine = false;
    do{
        let tempRow = randomNumber(0,19), tempColumn = randomNumber(0,19);
        if(!cells[tempRow][tempColumn].hasMine){
            cells[tempRow][tempColumn].hasMine = true;
            newMine = true;
        }
    }while(!newMine)
}
for(let row = 0; row < cells.length;row++){
    for(let column = 0; column < cells[row].length;column++)
    {
        let topRow = row == 0;
        let bottomRow = row == 19;
        let leftColumn = column == 0;
        let rightColumn = column == 19;
        let mines = 0;
        
        

        if ((!topRow && !leftColumn) && cells[row - 1][column - 1].hasMine)
            mines++;
        if(!topRow && cells[row-1][column].hasMine)
            mines++;
        if((!topRow && !rightColumn) && cells[row - 1][column + 1].hasMine)
            mines++;
        if(!rightColumn && cells[row][column+1].hasMine)
            mines++;
        if((!bottomRow && !rightColumn) && cells[row + 1][column+1].hasMine)
            mines++;
        if(!bottomRow && cells[row+1][column].hasMine)
            mines++;
        if((!bottomRow && !leftColumn) && cells[row + 1][column - 1].hasMine)
            mines++;
        if(!leftColumn && cells[row][column-1].hasMine)
            mines++;

        cells[row][column].setAdjacentMines(mines);
    }
}
cells.forEach(row => row.forEach(spot => {
    spot.element.addEventListener("mousedown", function(event){
        if(event.button == 0){
            spot.reveal();
        }else if (event.button == 1){
            spot.mark();
        }
    });
}))
changeLabel();

function endGame(){
    
}