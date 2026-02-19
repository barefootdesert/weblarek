import { IApi } from '../../types/index';
import { IProductResponse, IOrderRequest, IOrderResponse } from '../../types/index';

export class ApiComposition {
    private instanceApi: IApi;

    constructor(instanceApi: IApi) {
        this.instanceApi = instanceApi;
    }

    getProducts(): Promise<IProductResponse> {
        return this.instanceApi.get<IProductResponse>('products.json');
    }

    postOrder(order: IOrderRequest): Promise<IOrderResponse> {
        if (import.meta.env.MODE === 'development') {
            console.log('Мок: Заказ отправлен', order);
            return Promise.resolve({ total: order.total, id: 'mock-order-id' });  
        }
        return this.instanceApi.post<IOrderResponse>('/order', order);
    }
}