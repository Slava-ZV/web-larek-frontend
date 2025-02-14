//представление одной карточки
import {ensureElement} from "../utils/utils"
import {Component} from "./base/Component";
import {CategoryColor} from '../utils/constants'

interface IProductCard {
    onClick: (event: MouseEvent) => void;
}

export interface ICard<T> {
    title: string;
    price: number;
    category?: string;
    description?: string;
    image?: string;
}

export class Card<T> extends Component<ICard<T>> {
    
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _category?: HTMLElement;
    protected _button?: HTMLButtonElement;
    
    constructor(container: HTMLElement, actions?: IProductCard) {
        super(container);

        this._title = ensureElement<HTMLElement>(`.card__title`, container);
        this._price = ensureElement<HTMLElement>(`.card__price`, container);
        this._button = container.querySelector(`.card__button`);

        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
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

    setColor(category: string){
        const color = (Object.keys(CategoryColor) as (keyof typeof CategoryColor)[])
            .find(key => {
                return CategoryColor[key] === category
            })

        this._category.classList.add(`card__category_${color}`)
    }

}

export type TCatalogItem = {
    image: HTMLImageElement;
    category: HTMLElement;
};

export class CatalogItem extends Card<TCatalogItem> {
    protected _category: HTMLElement;
    protected _image: HTMLImageElement;

    constructor(container: HTMLElement, actions?: IProductCard) {
        super(container, actions);
        this._image =  ensureElement<HTMLImageElement>(`.card__image`, container);
        this._category = ensureElement<HTMLElement>(`.card__category`, container);
    }

    set category(value: string) {
        this.setColor(value);
        this.setText(this._category,value);
    }

    set image(value: string) {
        this.setImage(this._image, value, this.title)
    }
}


export class PreviewItem extends Card<HTMLElement> {
    protected _category: HTMLElement;
    protected _image: HTMLImageElement;
    protected _description: HTMLElement;

    constructor(container: HTMLElement, actions?: IProductCard) {
        super(container, actions);
        this._image =  ensureElement<HTMLImageElement>(`.card__image`, container);
        this._description = ensureElement<HTMLElement>(`.card__text`, container);
        this._category = ensureElement<HTMLElement>(`.card__category`, container);

        this._button = container.querySelector(`.card__button`);
    }

    set image(value: string) {
        this.setImage(this._image, value, this.title)
    }

    set description(value: string) {
        this.setText(this._description, value);
    }

    set category(value: string) {
        this.setColor(value);
        this.setText(this._category,value);
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

export interface IProductBasket {
    сount: number;
}

export class BasketItem extends Card<IProductBasket> {
    protected _count: HTMLElement;

    constructor(container: HTMLElement, actions?: IProductCard) {
        super(container, actions);

        this._count = container.querySelector(`.basket__item-index`)
        this._button = container.querySelector(`.card__button`);
        this._button.addEventListener('basket:delete', (event: MouseEvent) => {
            actions?.onClick?.(event);})
    }

    set count(value: number) {
        this.setText(this._count, value);
    }

}

