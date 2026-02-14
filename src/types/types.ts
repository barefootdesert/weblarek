export type  TBasketItem = Pick<IProduct, 'id' | 'title' | 'price'>;

export type TPaymentMethod = 'online' | 'on_delivery' | null;

export interface IUserData {
	payment: TPaymentMethod;
	email: string;
	phone: string;
	address: string;
}

export interface IProduct { //карточка товара
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

export  interface IOrder extends IUserData {
	items: string[]
}

export interface ICardBasket {
	id: string;
	title: string;
	price: number | null;
	index: number;
}

export interface IProductsData {
	items: IProduct[];
	preview: string | null;
	total: number;
}

export interface  IProductsCatalog { //ПЕРЕДАТЬ В КЛАСС
	fillCatalog(item: IProduct): void;
	getCatalog(): IProductsData;
}

export interface IUserBasket {
	addItem(item: IProduct): void;
	deleteItem(cardId: string): void; //может быть понадобиться функция
	clearBasket(): void; //очистка всех карточек из корзины
	getItemsList(): TBasketItem[]; //получения списка карточек
	checkedAllItems?(): IProduct;
	isInBasket(product: IProduct): boolean
	getTotal(): number
}


