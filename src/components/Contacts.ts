import {Form} from "./common/Form";
import {IContactsForm} from "../types";
import {IEvents} from "./base/events";
import {ensureElement} from "../utils/utils";

export class Contacts extends Form<IContactsForm> {
    protected formErrors: HTMLSpanElement;
    protected orderButton: HTMLButtonElement;


    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this.formErrors = ensureElement('.form__errors', this.container) as HTMLSpanElement;
        this.orderButton = ensureElement('button[type="submit"]', this.container) as HTMLButtonElement;
    }

    set phone(value: string) {
        (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
    }

    set email(value: string) {
        (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
    }
}