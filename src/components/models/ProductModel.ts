import { IProduct } from '../../types/index';
import { IEvents } from '../base/Events';

export class ProductCatalog {
    private arrayProducts: IProduct[] = [];
    private selectedProduct?: IProduct;

    constructor(protected events: IEvents) {}

    setArrayProducts(arrayProducts: IProduct[]): void {
        this.arrayProducts = [...arrayProducts];
        this.events.emit('products:changed');
    }

    getArrayProducts(): IProduct[] {
        return [...this.arrayProducts];
    }

    setSelectedProduct(product: IProduct): void {
        this.selectedProduct = { ...product };
        this.events.emit('product:selected', this.selectedProduct);
    }

    getSelectedProduct(): IProduct | undefined {
        return this.selectedProduct ? { ...this.selectedProduct } : undefined;
    }
}