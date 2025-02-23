import {Model} from "./base/Model";
import {IProduct, IAppState,  IOrderForm, IOrder, IContactsForm, FormErrors} from "../types";

export type CatalogChangeEvent = {
    catalog: IProduct[]
};

export class AppState extends Model<IAppState> {

    catalog: IProduct[];
    order: IOrder = {
        payment: "",
        address: "",
        email: "",
        phone: "",
        items: []
    };
    preview: string | null;
    
    formErrors: FormErrors = {};

    setCatalog(items: IProduct[]) {
        this.catalog = items;
        this.emitChanges('items:changed', this.catalog);
    }

    getCatalog(): IProduct[]{
        return this.catalog;
    }

    getItem(id: string): IProduct{   
        return this.catalog.find(item => item.id === id);
    }

    setPreview(item: IProduct) {
        this.preview = item.id;
        this.emitChanges('preview:changed', item);
    }

    addItem(item:  IProduct){
        if(item.price !== null){
            this.order.items.push(item.id);
        }
        this.emitChanges('basket:changed', item);
    }

    removeItem(item:  string){
        this.order.items = this.order.items.filter(it => it !== item);

        this.emitChanges('basket:changed', this.catalog.filter(it => it.id === item));
    }

    getTotal() {
        let count = 0;
        for ( let i = 0; i < this.order.items.length; i++){
            count += this.catalog.find(card => card.id === this.order.items[i]).price
        }
        return count;
    }

    getBasket(): string[]{
        return this.order.items;
    }

    setOrderField(field: keyof IOrderForm, value: string) {
        this.order[field] = value;
        this.events.emit('order-part:change');
        this.validateOrder();
    }

    validateOrder() {
        const errors: typeof this.formErrors = {};
        if (!this.order.payment) {
            errors.payment = 'Необходимо указать способ оплаты';
        }
        if (!this.order.address) {
            errors.address = 'Необходимо указать адрес';
        }
        this.formErrors = errors;
        this.events.emit('formErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }

    setContactsField(field: keyof IContactsForm, value: string) {
        this.order[field] = value;
        this.events.emit('contacts-part:change');
        this.validateContacts();
    }

    validateContacts() {
        const errors: typeof this.formErrors = {};
        if (!this.order.email) {
            errors.email = 'Необходимо указать email';
        }
        if (!this.order.phone) {
            errors.phone = 'Необходимо указать телефон';
        }
        this.formErrors = errors;
        this.events.emit('formContactsErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }

    isItemInBasket(id:string):boolean{
        return this.order.items.some(item => item === id);
    }

    clearCustomerInfo() {
        this.order.address = '';
        this.order.email = '';
        this.order.payment = '';
        this.order.phone = '';
    }

    clearBasket() {
        this.order.items = [];
        this.emitChanges('basket:changed', this.order.items);
    }
}