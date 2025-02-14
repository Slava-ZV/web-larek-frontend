// Товар
export interface IProduct{
    id: string;
    image: string;
    title: string;
    description: string;
    category: string;
    price: number | null;
}

export type TProductBasket = Pick< IProduct, 'title'  |'price'>;

export interface IAppState {
    catalog: IProduct[];
    basket: IProduct[];
    preview: string | null;
    order: IOrder | null;
}

export interface IOrderForm {
    payment: string;
    address: string;
}

export interface IContactsForm {
    email: string;
    phone: string;
}

export type IOrder =  IOrderForm & IContactsForm & {items: string[], total: number};

export type ContactsFormErrors = Partial<Record<keyof IContactsForm, string>>;

export type OrderFormErrors = Partial<Record<keyof IOrderForm, string>>;

export type FormErrors = ContactsFormErrors & OrderFormErrors;

export interface IOrderResult {
    items: string[];
    total: number;
}
