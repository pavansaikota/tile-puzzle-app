import './grid.js';
const html = `
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css">
    <link rel='stylesheet' href='app.css'/>
    <div class="container">
    <div class="header-container">
        <div id='title'>SNUBLE</div>
    </div>
    <div class="game-container">
        <div class="row">
            <div class="col-md-3">
                <div class="trackers">
                    <div class='tracker timer'><span>TIME:</span><span id='timer'>0</span></div>
                    <div class='tracker moves'><span>MOVES:</span><span id='moves'>0</span></div>
                </div>
                <div class="controls">
                    <button class='btn btn-warning' id='undo'>UNDO</button>
                    <button class='btn btn-success' id='new-game'>NEW GAME</button>
                    <button class='btn btn-primary' id='auto-solve'>AUTO SOLVE</button>
                </div>
            </div>
            <div class="col-md-6">
                <div class='grid'>
                    <grid-element></grid-element>
                </div>
                <div class = 'difficulty-level'>
                    <h6 class='header'>DIFFICULTY LEVEL</h6>
                    <div class="level-buttons">
                        <button class='btn btn-outline-primary' id='easy'>EASY</button>
                        <button class='btn btn-outline-success' id='medium'>MEDIUM</button>
                        <button class='btn btn-outline-warning' id='hard'>DIFFICULT</button>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
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
        this.$$('.level-buttons').addEventListener('click',(e)=>{
            if(e.target.id != e.currentTarget.id){
                this.resetGame(e.target.id);
            }
            e.stopPropagation();
        },false);
        this.$$('#new-game').addEventListener('click',()=>{
            this.resetGame(currentLevel);
        });

        this.$$('grid-element').addEventListener('finish',()=>{
            timer();
        });
        this.resetGame('easy');
    }

    resetGame(level){
        this.$$('grid-element').loadGame(level);
        this.$$('.grid').classList.remove(currentLevel);
        this.$$('.grid').classList.add(level);
        this.$$(`.level-buttons #${currentLevel}`).classList.remove('selected');
        this.$$(`.level-buttons #${level}`).classList.add('selected');
        currentLevel = level;
        timer = this.setTimer();
    }

    setTimer(){
        let start = 0;
        let timer = setInterval(()=>{
                        this.$$('#timer').innerHTML = start++;
                    },1000);
        return () => {
            clearInterval(timer);
        }
    }
}


customElements.define('tile-app',TileApp);

