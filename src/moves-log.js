const html = `
    <link rel='stylesheet' href='moves-log.css'/>
    <div class="moves-log">
        <h5>YOUR MOVES</h5>
        <ol id= "moves-list" class="moves-list"></ol>
    </div>
`

export class MoveLog extends HTMLElement{
    constructor(){
        super();
        this.attachShadow({mode:'open'}).innerHTML = html;
        this.$$ = css => this.shadowRoot.querySelector(css);
    }

    connectedCallback(){

    }


}
customElements.define('moves-log',MoveLog);