import { IProduct } from '../../types/index';
import { IEvents } from '../base/Events';

export class Basket {
    private products: IProduct[] = [];

    constructor(protected events: IEvents) {
    }

    getArrayBasket(): IProduct[] {
        return [...this.products];
    }

    addProduct(product: IProduct): void {
        const oldProducts = this.getArrayBasket();
        this.products.push(product);

        this.events.emit('basket:product:added', {
            product,
            products: this.getArrayBasket(),
            totalPrice: this.getTotalPrice(),
            itemsCount: this.getItemsCount(),
            oldProducts
        });
    }

    delProduct(id: string): void {
        const oldProducts = this.getArrayBasket();
        const removedProduct = this.products.find(item => item.id === id);

        this.products = this.products.filter(item => item.id !== id);

        if (removedProduct) {
            this.events.emit('basket:product:removed', {
                product: removedProduct,
                productId: id,
                products: this.getArrayBasket(),
                totalPrice: this.getTotalPrice(),
                itemsCount: this.getItemsCount(),
                oldProducts
            });
        }
    }

    clearBasket(): void {
        const oldProducts = this.getArrayBasket();
        this.products = [];

        this.events.emit('basket:cleared', {
            oldProducts,
            products: this.getArrayBasket(),
            totalPrice: this.getTotalPrice(),
            itemsCount: this.getItemsCount()
        });
    }

    getTotalPrice(): number {
        return this.products.reduce((total, product) => {
            return total + (product.price ?? 0);
        }, 0);
    }

    getItemsCount(): number {
        return this.products.length;
    }

    hasProduct(id: string): boolean {
        return this.products.some(item => item.id === id);
    }
}