import { IProduct, IUserBasket } from '../../types/types';
import { IEvents } from '../base/Events';

export class BasketData implements IUserBasket {
	protected items: IProduct[] = [];
	constructor(protected events: IEvents) {};

 addItem(item: IProduct): void {
		 this.items.push(item);

	 this.events.emit('basket:updated', this.items);
	};

	deleteItem(productID: string): void {
		this.items = this.items.filter(item => item.id !== productID);

		this.events.emit('basket:updated', this.items);
	};

	isInBasket(product: IProduct){
		return this.items.some(item => item.id === product.id)
	};

	clearBasket(): void{
		this.items = [];
		this.events.emit('basket:updated', this.items);
	};

	getItemsList(){
		return this.items;
	};

	getTotalCount(): number {
		return this.items.length;
	};

	getTotal(): number {
		return this.items.reduce((acc: number, val: IProduct) => acc + (val.price), 0);
	};
}