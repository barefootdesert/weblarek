import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

interface IBasketView {
	items: HTMLElement[];
	total: number;
	totalPrice: number | null;
	renderItemList: HTMLElement[];
	updateButtonState: number;
	button: HTMLButtonElement;

}

export class Basket extends Component<IBasketView> {
protected itemList: HTMLElement;
protected total: HTMLElement;
protected button: HTMLButtonElement;
protected events: IEvents;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;

		this.itemList = ensureElement<HTMLElement>('.basket__list', container);
		this.total = ensureElement<HTMLElement>('.basket__price', container);
		this.button = ensureElement<HTMLButtonElement>('.basket__button', container);

		this.button.addEventListener('click', () => {
			this.events.emit('basket-submit:next');
		});
	};

	protected set totalPrice(value: number | null) {
		this.setText(this.total, `${value} синапсов`);
	};

	protected set renderItemList(element: HTMLElement[]) {
		this.itemList.replaceChildren(...element);
	};

	clear() {
		this.itemList.innerHTML = '';
	};
	updateButtonState(value: number) {
		this.setDisabled(this.button, !value);
	}

}