const html = `
    <link rel='stylesheet' href='tile.css'/>
    <div class='tile'><span class='num'></span></div>
`

export class Tile extends HTMLElement{
    constructor(){
        super();
        this.attachShadow({mode:'open'}).innerHTML = html;
        this.$$ = css => this.shadowRoot.querySelector(css);
    }


    static get observedAttributes(){
        return ['num'];
    }

    connectedCallback(){
    
    }

    attributeChangedCallback(attrName,oldVal,newVal){
        if(attrName == 'num' && newVal !=null && oldVal!=newVal){
            this.$$('.num').innerHTML = newVal; 
        }
    }
}
customElements.define('tile-element',Tile);