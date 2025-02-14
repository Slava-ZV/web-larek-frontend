import {IEvents} from "./base/events";
import {Form} from "./common/Form";
import {IOrderForm} from "../types";

export class Order extends Form<IOrderForm> {
    protected cardBtn: HTMLButtonElement;
    protected cashBtn: HTMLButtonElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        
        this.cardBtn = container.querySelector('[name="card"]') as HTMLButtonElement;
        this.cashBtn = container.querySelector('[name="cash"]') as HTMLButtonElement;

        this.cardBtn.addEventListener('click', (e: Event) => {
            const target = e.target as HTMLInputElement;
            const field = 'payment';
            const value = target.name;
            this.events.emit(`${this.container.name}:change`, {field, value});
        });

        this.cashBtn.addEventListener('click', (e: Event) => {
            const target = e.target as HTMLInputElement;
            const field = 'payment';
            const value = target.name;
            this.events.emit(`${this.container.name}:change`, {field, value});
        });

        this.container.addEventListener('submit', (evt) =>{
            evt.preventDefault();
            this.events.emit(`${this.container.name}:submit`)
        })
        
    }

    set address(value: string){
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
    }

    set payment(value: string) {
        this.toggleClass((this.container.elements.namedItem('card') as HTMLInputElement), 'button_alt', (this.container.elements.namedItem('card') as HTMLInputElement).name !== value);
        this.toggleClass((this.container.elements.namedItem('cash') as HTMLInputElement), 'button_alt', (this.container.elements.namedItem('cash') as HTMLInputElement).name !== value);
    }

}





























// import {Form} from "./common/Form";
// import {IOrderForm} from "../types";
// import {EventEmitter, IEvents} from "./base/events";
// import {ensureElement} from "../utils/utils";



// export class Order extends Form<IOrderForm> {
//     protected _buttonCard: HTMLButtonElement;
//     protected _buttonCash: HTMLButtonElement;


//     constructor(container: HTMLFormElement, events: IEvents) {
//         super(container, events);
//         this._buttonCard = container.querySelector(`.button button_alt`);
//         // this._buttonCash.addEventListener('', (event: MouseEvent) => {
//             // actions?.onClick?.(event);})
//         // this._buttonCard.addEventListener('click', () => this.events.emit('selectBuy:select'));
//         // this._buttonCard.addEventListener('click', () => this.events.emit('selectBuy:select'));
//     }
//     set adress(value: string) {
//         (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
//     }

//     set buttonCard(value: string) {
//         this.container.elements.namedItem('card') as HTMLButtonElement;
//     }

//     set buttonCash(value: string) {
//         this.container.elements.namedItem('cash') as HTMLButtonElement;
//     }
// }