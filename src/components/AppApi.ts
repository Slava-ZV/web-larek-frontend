import { IProduct } from "../types";
import { Api, ApiListResponse } from "./base/api";
import {IOrder, IOrderResult} from "../types";

export interface IProductAPI {
    getProductList: () => Promise<IProduct[]>;
    getProductItem: (id: string) => Promise<IProduct>;
}

export class AuctionAPI extends Api implements IProductAPI {

    readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    //получение всех карточек продуктов
    getProductList(): Promise<IProduct[]> {
        return this.get('/product').then((data: ApiListResponse<IProduct>)=>
            data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image,
            }))
        )
    }

    getProductItem(id: string): Promise<IProduct> {
        return this.get(`/product/${id}`).then(
            (item: IProduct) => ({
            ...item,
            image: this.cdn + item.image})  
        );
    }

    orderProducts(order: IOrder): Promise<IOrderResult> {
        console.log(order);
        return this.post('/order', order).then(
            (data: IOrderResult) => {console.log('data');
                return data}
        );
    }
}