import './tile.js';
const html = `
    <link rel='stylesheet' href='grid.css'/>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css">
    <div id = 'grid' class='grid'></div>
    <div id='game-status'><b>You Won</b></div>
`;

class Level {
    constructor(size, steps, length) {
        this.size = size;
        this.steps = steps;
        this.length = length;
    }
}

const levels = {
    easy: new Level(3,12,200),
    medium: new Level(4,16,260),
    hard: new Level(6,20,380)  
}
let size;
let tilesArray;
let emptyTilePosition;
let listenerAdded = false;
let isGameFinished = false;
let movesStack = [];
class Grid extends HTMLElement{
    constructor(){
        super();
        this.attachShadow({mode:'open'}).innerHTML = html;
        this.$$ = css => this.shadowRoot.querySelector(css);
    }

    loadGame(level){
        movesStack.length = 0;
        size = levels[level]['size'];
        isGameFinished = false;
        let game = createSolvableGame(level);
        tilesArray = game.array;
        emptyTilePosition = game.emptyTilePosition;
        this.setGame(level);
        if(!listenerAdded){
            this.$$('#grid').addEventListener('click',this.makeMovement.bind(this),false);
        }
    }

    makeMovement(e){
        if(e.target !== e.currentTarget && !isGameFinished){
            let currentPosition = parseInt(e.target.getAttribute('pos'));
            let currentNumber = parseInt(e.target.getAttribute('num'));
            if(currentPosition !== emptyTilePosition && isMovementPossible(currentPosition,emptyTilePosition,size)){
                movesStack.push({oldPos:currentPosition,newPos:emptyTilePosition,num:currentNumber});
                this.makeMove(currentPosition,currentNumber,movesStack);
                if(isGameComplete([...tilesArray])){
                    this.finishGame();
                }
            }
        }
        e.stopPropagation();
    }

    finishGame(){
        isGameFinished = true;
        this.$$('#game-status').style.display = 'block';
        let finishEvent = new Event('finish');
        this.dispatchEvent(finishEvent);
    }

    makeMove(currentPosition,currentNumber,moves){
        this.$$(`#block${emptyTilePosition}`).setAttribute('num',currentNumber);
        tilesArray[emptyTilePosition] = currentNumber;
        this.$$(`#block${currentPosition}`).setAttribute('num',0);
        tilesArray[currentPosition] = 0;
        emptyTilePosition = currentPosition;
        let moveEvent = new CustomEvent('move',{
            bubbles:true,
            cancelable:true,
            detail:{
                moves:moves.slice(0,moves.length)
            }
        });
        this.dispatchEvent(moveEvent);
    }

    undo(){
        if(movesStack.length > 0 && !isGameFinished){
            let lastMove = movesStack.pop();
            this.makeMove(lastMove.newPos,lastMove.num,movesStack);
            return true;
        }
        return false;
    }

    setGame(level){
        this.$$('#game-status').style.display = 'none';
        this.$$('.grid').innerHTML = "";
        let l = levels[level]['length'];
        this.$$('.grid').style.width = l+'px';
        this.$$('.grid').style.height = l+'px';
        this.$$('#game-status').style.width = l+'px';
        let row = "<div class='row no-gutters'>";
        let totalRows = '';
        let arrSize = size*size;
        for(let i=0;i<arrSize;i++){
            let eleNo = tilesArray[i];
            row += `<div class='col-${12/size}'><tile-element id= block${i} pos=${i} num=${eleNo}></tile-element></div>`;
            if((i+1)%size == 0){
                row += '</div>';
                totalRows += row;
                row = "<div class='row no-gutters'>";
            }
        }
        this.$$('.grid').innerHTML = totalRows;
    }

    async autoSolve(){
        let lastState = -1;
        let m = 0;
        while(!isGameComplete([...tilesArray]) && m < 50){
            let newArray = [...tilesArray];
            let nextState = getNextState(newArray,emptyTilePosition,lastState);
            lastState = emptyTilePosition;
            await new Promise(resolve=>setTimeout(()=>resolve('done'),500));
            movesStack.push({oldPos:nextState,newPos:emptyTilePosition,num:tilesArray[nextState]});
            this.makeMove(nextState,tilesArray[nextState],movesStack);
            m++;
        }
    }
}
customElements.define('grid-element',Grid);

function getRandomInt(max) {
    return (Math.floor(Math.random() * Math.floor(max))*31)%max + 1;
}

function getNextState(tilesArray,emptyPosition,lastState){
    let possibleMoves = [];
    let x = Math.floor(emptyPosition/size);
    let y = emptyPosition%size;
    if(x-1>=0){
        let n = (x-1)*size+y;
        if(n!=lastState){
            possibleMoves.push(n);
        }
    }
    if(x+1<size){
        let n = (x+1)*size+y;
        if(n!=lastState){
            possibleMoves.push(n);
        }
    }
    if(y+1<size){
        let n = (x)*size+(y+1);
        if(n!=lastState){
            possibleMoves.push(n);
        }
    }
    if(y-1>=0){
        let n = (x)*size+ (y-1);
        if(n!=lastState){
            possibleMoves.push(n);
        }
    }
    let score = 1000;
    let nextState = emptyPosition;
    for(let i=0;i<possibleMoves.length;i++){
        let newArray = [...tilesArray];
        let temp = newArray[possibleMoves[i]];
        newArray[possibleMoves[i]] = 0;
        newArray[emptyPosition] = temp;
        let tempScore = fScore(newArray);
        if(tempScore < score){
            score = tempScore;
            nextState = possibleMoves[i];
        }
    }
    return nextState;
}

function fScore(array){
    let score = -1;
    for(let i=0;i<array.length;i++){
        if(array[i] != i+1){
            score++;
        }
    }
    return score;
}

function createSolvableGame(level){
    const size = levels[level]['size'];
    let arrSize = size*size;
    let arr = new Array(arrSize);
    for(let i=0; i<arrSize;i++){
        arr[i] = i+1;
    }
    arr[arrSize-1] = 0;
    // move the 0 element in the array randomly by a certain number of steps
    let emptyPosition = arrSize-1;
    for(let i=0; i<levels[level]['steps']; i++){
        let newPos = getRandomPossibleMove(emptyPosition,size);
        arr[emptyPosition] = arr[newPos];
        arr[newPos] = 0;
        emptyPosition = newPos;
        console.log(arr);
    }
    return {array:arr,emptyTilePosition:emptyPosition};
}

function getRandomPossibleMove(currentPosition,size){
    let newPosition = currentPosition;
    while(!isMovementPossible(currentPosition,newPosition,size)){
        let randInt = getRandomInt(4);
        console.log(randInt);
        switch(randInt){
            case 1:
                newPosition = currentPosition + 1;
                break;
            case 2:
                newPosition = currentPosition - 1;
                break;
            case 3:
                newPosition = currentPosition + size;
                break;
            case 4:
                newPosition = currentPosition - size;
                break;
        }
    }

    return newPosition;
}

function isMovementPossible(currentPosition,newPosition,gridSize){
    let max = gridSize-1;
    let x1 = Math.floor(currentPosition/gridSize);
    let y1 = currentPosition%gridSize;
    let x2 = Math.floor(newPosition/gridSize);
    let y2 = newPosition%gridSize;
    if(x2 < 0 || y2 < 0 || x2 > max ||y2 > max) return false;
    let a = Math.abs(x1 - x2) + Math.abs(y1 - y2);
    if( a == 1){
        return true;
    }else{
        return false;
    }
}

function isGameComplete(tilesArray) {
    for(let i = 0; i < tilesArray.length; i++){
        if(tilesArray[i] != i+1 && i != tilesArray.length - 1){
            return false;
        }else if( i == tilesArray.length && tilesArray[i] !==  0){
            return false;
        }
    }
    return true;
}