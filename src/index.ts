import './scss/styles.scss';
import { AuctionApi} from "./components/AuctionApi";
import {API_URL, CDN_URL} from "./utils/constants";
import {EventEmitter} from "./components/base/events";
import {AppState, CatalogChangeEvent} from "./components/AppData";
import {Page} from "./components/Page";
import {FullCard, CatalogCard, BasketItem} from "./components/Product";
import {cloneTemplate, ensureElement} from './utils/utils';
import {IOrder, IOrderForm, IProduct} from './types/index';
import { Modal } from './components/common/Modal';
import {Basket} from "./components/common/Basket";
import {Contacts} from "./components/Contacts";
import { Order} from './components/Order';
import { Success} from './components/common/Success';
import {IContactsForm} from "./types";

const events = new EventEmitter();
const api = new AuctionApi(CDN_URL, API_URL);

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
    // console.log(eventName, data);
})

//объявление шаблонов
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');


const order = new Order(cloneTemplate(orderTemplate), events);
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);

//создание объекта модели данных приложения
const appData = new AppState({}, events);

// создание основных объектов приложения
const page = new Page(document.querySelector('.page__wrapper') as HTMLElement, events);
const modal = new Modal(document.querySelector('#modal-container') as HTMLElement, events);

const basket = new Basket(cloneTemplate(basketTemplate), events);
const success = new Success(cloneTemplate(successTemplate), {
    onClick: () => {
        modal.close();
    }
});

// Изменение элементов каталога
events.on<CatalogChangeEvent>('items:changed', () => {
    page.catalog = appData.catalog.map(item => {
        const card = new CatalogCard(cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit('card:select', item)
        });
        return card.render({
            title: item.title,
            price: item.price,
            category: item.category,
            image: item.image,
        });
    });

});


// Открыть лот
events.on('card:select', (item: IProduct) => {
    appData.setPreview(item);
});

events.on('preview:changed', (item: IProduct) => {
    const showItem = (item: IProduct) => {
        const card = new FullCard(cloneTemplate(cardPreviewTemplate),
        {onClick: () =>{
            appData.addItem(item);
            card.inBasket();
        }});
        if(appData.isItemInBasket(item.id)){
            card.inBasket();
        }
        if(item.price === null){
            card.buyNot();
        }
        modal.render({
            content: card.render({
                title: item.title,
                image: item.image,
                description: item.description,
                category: item.category,
                price: item.price,
            }),
            
        });

    };

    if (item) {
        showItem(item);
    } else {
        modal.close();
    }
});


events.on('basket:open', () => {
    modal.render({content: basket.render()})
});

events.on('basket:changed', () => {

    const itemsHTMLArray = appData.getBasket().map((id, index) =>{
        const bag = new BasketItem(cloneTemplate(cardBasketTemplate),
        {onClick: () => events.emit('basket:delete', {id: id})})
        bag.count = index + 1; 

        return bag.render(appData.getItem(id))
    })

    basket.items = itemsHTMLArray;
    basket.total = appData.getTotal();

    page.counter = appData.getBasket().length;
});



events.on('basket:delete', (data:{id: string}) => {
    appData.removeItem((data.id));
});

events.on('order:open', () => {
    appData.clearCustomerInfo()
    modal.render({
        content: order.render({
            payment: appData.order.payment,
            address: appData.order.address,
            valid: false,
            errors: []
        })
    });
});

events.on('formErrors:change', (errors: Partial<IOrderForm>) => {
    const { payment, address } = errors;
    order.valid = !payment && !address;
    order.errors = Object.values({payment, address}).filter(i => !!i).join('; ');
});

events.on('order:change', (event: {field: keyof IOrderForm, value:string}) => {
    appData.setOrderField(event.field, event.value);
});

events.on('order-part:change', (event: {order: IOrder}) => {
    order.payment = appData.order.payment;
});

events.on(/^order\..*:change/, (data: { field: keyof IOrderForm, value: string }) => {
    appData.setOrderField(data.field, data.value);
});

events.on('order:submit', () => {
    modal.close()
    modal.render({
        content: contacts.render({
            email: appData.order.email,
            phone: appData.order.phone,
            valid: false,
            errors: []
        })
    });
});

events.on('formContactsErrors:change', (errors: Partial<IContactsForm>) => {
    const { email, phone } = errors;
    contacts.valid = !email && !phone;
    contacts.errors = Object.values({email, phone}).filter(i => !!i).join('; ');
});

events.on('contacts-part:change', (event: {order: IOrder}) => {
    contacts.email = appData.order.email;
});

// Изменилось одно из полей
events.on(/^contacts\..*:change/, (data: { field: keyof IContactsForm, value: string }) => {
    appData.setContactsField(data.field, data.value);
});

// Отправлена форма заказа
events.on('contacts:submit', () => {
    api.orderProducts({...appData.order, total: appData.getTotal()})
        .then((result) => {
            modal.render({
                content: success.render({
                    total: result.total,
                })
                
            });
            appData.clearBasket();
        })
        .catch(err => {
            console.error(err);
        });
});


// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
    page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
    page.locked = false;
});

// Получаем лоты с сервера
api.getProductList()
    .then(appData.setCatalog.bind(appData))
    .catch(err => {
        console.error(err);
});

