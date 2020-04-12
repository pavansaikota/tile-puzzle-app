const html = `
    <link rel='stylesheet' href='moves-log.css'/>
    <div class="moves-log">
        <h5>YOUR MOVES</h5>
        <ul id= "moves-list" class="moves-list"></ul>
    </div>
`
let movesStack = [];
export class MoveLog extends HTMLElement{
    constructor(){
        super();
        this.attachShadow({mode:'open'}).innerHTML = html;
        this.$$ = css => this.shadowRoot.querySelector(css);
    }

    updateMoves(moves){
        if(moves.length == 0){
            this.clearLogs();
        }
        else if(moves.length > movesStack.length){
            movesStack.push(moves[moves.length-1]);
            this.addMove(movesStack[moves.length-1]);
        }
        else if(movesStack.length > moves.length){
            movesStack.pop();
            this.removeLastMove();
        }
    }

    clearLogs(){
        movesStack = [];
         this.$$('#moves-list').innerHTML = "";
    }

    addMove(move){
        let li = document.createElement('li');
        li.innerText = `${move.num}: ${move.oldPos} --> ${move.newPos}`;
        this.$$('#moves-list').appendChild(li);
    }

    removeLastMove(){
        let list = this.$$('#moves-list');
        list.removeChild(list.childNodes[list.childNodes.length-1]);
    }
}
customElements.define('moves-log',MoveLog);