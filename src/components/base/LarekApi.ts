import { IApi } from '../../types/index';
import { IProductResponse, IOrderRequest, IOrderResponse } from '../../types/index';

export class ApiComposition {
    private instanceApi: IApi;

    constructor(instanceApi: IApi) {
        this.instanceApi = instanceApi;
    }

    /**
     * Получить каталог товаров
     */
    getProducts(): Promise<IProductResponse> {
        return this.instanceApi.get<IProductResponse>('products.json');
    }

    /**
     * Оформить заказ — всегда отправляем на сервер
     */
    postOrder(order: IOrderRequest): Promise<IOrderResponse> {
        return this.instanceApi.post<IOrderResponse>('/order', order);
    }
}