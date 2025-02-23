//представление одной карточки
import {ensureElement} from "../utils/utils"
import {Component} from "./base/Component";
import {CategoryColor} from '../utils/constants'

interface IProductCard {
    onClick: (event: MouseEvent) => void;
}

export interface ICard {
    title: string;
    price: number;
    category?: string;
    description?: string;
    image?: string;
}

export class Card extends Component<ICard> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _button?: HTMLButtonElement;

    constructor(container: HTMLElement) {
        super(container);

        this._title = ensureElement<HTMLElement>(`.card__title`, container);
        this._price = ensureElement<HTMLElement>(`.card__price`, container);
        this._button = container.querySelector(`.card__button`);
    }

    //для сохранения id карточки
    set id(value: string) {
        this.container.dataset.id = value
    }

    get id(): string {
        return this.container.dataset.id || '';
    }

    //для показа названия карточки
    set title(value: string) {
        this.setText(this._title, value);
    }

    get title(): string {
        return this._title.textContent || '';
    }
    
    set price(value:  number | null) {
        if (value === null){
            this.setText(this._price, `Бесценно`);
        }
        else{
            this.setText(this._price, `${value} синапсов`);
        }
    }
}

export class CatalogCard extends Card {
    protected _category: HTMLElement;
    protected _image: HTMLImageElement;
    
    constructor(container: HTMLElement, actions?: IProductCard) {
        super(container);

        this._category = ensureElement<HTMLElement>(`.card__category`, container);
        this._image =  ensureElement<HTMLImageElement>(`.card__image`, container);

        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    set category(value: string) {
        this.setColor(value);
        this.setText(this._category,value);
    }

    set image(value: string) {
        this.setImage(this._image, value, this.title)
    }

    setColor(category: string){
        const color = (Object.keys(CategoryColor) as (keyof typeof CategoryColor)[])
            .find(key => {
                return CategoryColor[key] === category
            })

        this._category.classList.add(`card__category_${color}`)
    }

}

export class FullCard extends CatalogCard {
    protected _description: HTMLElement;

    constructor(container: HTMLElement, actions?: IProductCard) {
        super(container, actions);

        this._description = ensureElement<HTMLElement>(`.card__text`, container);
    }

    set description(value: string) {
        this.setText(this._description, value);
    }
    
    inBasket() {
        this._button.textContent = 'В корзине';
        this.setDisabled(this._button, true);
    }
    
    buyNot(){
        this._button.textContent = 'Недоступен';
        this.setDisabled(this._button, true);
    }
}

export class BasketItem extends Card {
    protected _count: HTMLElement;

    constructor(container: HTMLElement, actions?: IProductCard) {
        super(container);

        this._count = container.querySelector(`.basket__item-index`)

        this._button.addEventListener('click', (event: MouseEvent) => {
            actions?.onClick?.(event);})
    }

    set count(value: number) {
        this.setText(this._count, value);
    }

}