import { IProduct } from '../../types/types';
import { EventEmitter, IEvents } from '../base/Events';

interface IProductsModel {
	setProducts(products: IProduct[]): void;
	getProductById(id: string): IProduct | undefined;
	getCatalog(): IProduct[];
}

export class ProductsModel implements IProductsModel { //interface
	protected products: IProduct[];

	constructor(protected events: IEvents) {
		this.events = events;
	}

	setProducts(products: IProduct[]) {
		this.products = products
		this.events.emit('products:changed')
	}

	getProductById(id: string): IProduct | undefined {
		return this.products.find((item) => item.id === id);
	}

	getCatalog() {
		return this.products;
	}
}