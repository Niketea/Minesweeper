class Spot{
    constructor(cell){
        this.element = cell;
        this.row = Number(cell.getAttribute("rowIndex"));
        this.column = Number(cell.getAttribute("columnIndex"));
        this.hasMine = false;
        this.adjacentMines = 0;
        this.revealed = false;
    }

    //Makes the spot green depending on its position to create a checkerboard
    makeGreen(){
        if((this.row + this.column) % 2 == 0){
            this.element.style.backgroundColor = "lightgreen";
        }else{
            this.element.style.backgroundColor = "darkgreen";
        }
    }

    //Makes the spot tan depending on its position to create a checkerboard
    makeTan(){
        if((this.row + this.column) % 2 == 0){
            this.element.style.backgroundColor = "tan";
        }else{
            this.element.style.backgroundColor = "wheat";
        }
    }

    //Reveals that a spot is a bomb
    makeBomb(){
        this.element.style.backgroundColor = "red";
    }

    /* Reveals the spot showing how many mines are adjecent and reveals neighboring spots if
       adjecent mines equals 0 
    */
    reveal(){
        if(this.hasMine){
            this.makeBomb();
            endGame();
        }else{
        
            this.makeTan();
            this.revealed = true;
            this.element.innerHTML = "";

            //Reveals neighboring spots if adjacentMines = 0
            if(this.adjacentMines == 0){
                let topRow = this.row == 0;
                let bottomRow = this.row == 19;
                let leftColumn = this.column == 0;
                let rightColumn = this.column == 19;
                
                //Reveals neighboring spots
                if (!topRow && !leftColumn && !cells[this.row - 1][this.column - 1].revealed) //Top-Left
                    cells[this.row - 1][this.column - 1].reveal();
                if(!topRow && !cells[this.row-1][this.column].revealed) //Top
                    cells[this.row-1][this.column].reveal();
                if(!topRow && !rightColumn && !cells[this.row - 1][this.column + 1].revealed) // Top-Right
                    cells[this.row - 1][this.column + 1].reveal();
                if(!rightColumn && !cells[this.row][this.column+1].revealed) // Right
                    cells[this.row][this.column+1].reveal();
                if(!bottomRow && !rightColumn && !cells[this.row + 1][this.column+1].revealed) //Bottom-Right
                    cells[this.row + 1][this.column+1].reveal();
                if(!bottomRow && !cells[this.row+1][this.column].revealed) //Bottom
                    cells[this.row+1][this.column].reveal();
                if(!bottomRow && !leftColumn && !cells[this.row + 1][this.column - 1].revealed) // Bottom-Left
                    cells[this.row + 1][this.column - 1].reveal();
                if(!leftColumn && !cells[this.row][this.column-1].revealed) // Left
                    cells[this.row][this.column-1].reveal();

            }else{
                this.displayMines();
            }
        }
    }
    
    //Marks the spot with an "X" after a middleclick
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
            displayNumberOfMines();
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
const tempCells = document.querySelectorAll(".cell");
const label = document.querySelector("#label");

let cells = [];


// Creates a 2D Array with Spot Objects representing the grid
tempCells.forEach(cell => {
    if(cell.getAttribute("columnIndex") == 0){
        cells.push([]);
    }
    cells[cell.getAttribute("rowIndex")].push(new Spot(cell));
})

//Makes the board unrevealed
cells.forEach(row => row.forEach(spot => spot.makeGreen()));

function randomNumber(min,max)
{
    return Math.floor(Math.random() * (max-min+1)) + min;
}

function displayNumberOfMines(){
    label.innerHTML = "Mines: " + totalMines;
}

//Initializes spots with mines
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

//Sets the value of adjecentMines for all Spots
for(let row = 0; row < cells.length;row++){
    for(let column = 0; column < cells[row].length;column++)
    {
        let topRow = row == 0;
        let bottomRow = row == 19;
        let leftColumn = column == 0;
        let rightColumn = column == 19;
        let mines = 0;
        
        

        if ((!topRow && !leftColumn) && cells[row - 1][column - 1].hasMine) //Top-Left
            mines++;
        if(!topRow && cells[row-1][column].hasMine) //Top
            mines++;
        if((!topRow && !rightColumn) && cells[row - 1][column + 1].hasMine) //Top-Right
            mines++;
        if(!rightColumn && cells[row][column+1].hasMine) // Right
            mines++;
        if((!bottomRow && !rightColumn) && cells[row + 1][column+1].hasMine) // Bottom-Right
            mines++;
        if(!bottomRow && cells[row+1][column].hasMine) //Bottom
            mines++;
        if((!bottomRow && !leftColumn) && cells[row + 1][column - 1].hasMine) //Bottom-Left
            mines++;
        if(!leftColumn && cells[row][column-1].hasMine) // Left
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
displayNumberOfMines();

function endGame(){
    
}