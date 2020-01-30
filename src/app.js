import './grid.js';
const html = `
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css">
    <link rel='stylesheet' href='app.css'/>
    <div id='title'><h3>NUBLE</h3></div>
    <div class='game-container'>
    <div class='timer'><span>TIME:</span><span id='timer'></span></div>
    <div class='new-game'><button class='btn btn-outline-primary' id='new-game'>New Game</button></div>
    <div class='grid'>
        <grid-element></grid-element>
    </div>
    <div class = 'difficulty-level'>
        <h6 class='header'>DIFFICULTY LEVEL</h6>
        <div class="btn-group">
            <button class='btn btn-outline-primary' id='easy'>EASY</button>
            <button class='btn btn-outline-primary' id='medium'>MEDIUM</button>
            <button class='btn btn-outline-primary' id='hard'>DIFFICULT</button>
        </div>
    </div>
    </div>
`;
let currentLevel = 'easy';
let timer;
class TileApp extends HTMLElement{
    constructor(){
        super();
        this.attachShadow({mode:'open'}).innerHTML = html;
        this.$$ = css => this.shadowRoot.querySelector(css);
    }

    connectedCallback(){
        this.$$('.btn-group').addEventListener('click',(e)=>{
            if(e.target.id != e.currentTarget.id){
                this.resetGame(e.target.id);
            }
            e.stopPropagation();
        },false);
        this.$$('#new-game').addEventListener('click',()=>{
            this.resetGame(currentLevel);
        });
        timer = this.setTimer();
        this.resetGame('easy');
    }

    resetGame(level){
        this.$$('grid-element').loadGame(level);
        this.$$('.grid').classList.remove(currentLevel);
        this.$$('.grid').classList.add(level);
        currentLevel = level;
        timer();
    }

    setTimer(){
        let start;
        let timer;
        return () => {
            start=0;
            clearInterval(timer);
            timer = setInterval(()=>{
                this.$$('#timer').innerHTML = start++;
            },1000);
        }
    }
}


customElements.define('tile-app',TileApp);

