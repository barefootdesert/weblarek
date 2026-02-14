import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';
import { Component } from '../base/Component';

interface ISuccess {
	totalPrice: number;
}

export  class Success extends Component<ISuccess>{

	protected description: HTMLParagraphElement;
	protected button: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this.description = ensureElement<HTMLParagraphElement>('.order-success__description', container)
		this.button = ensureElement<HTMLButtonElement>('.order-success__close', container)

		this.button.addEventListener('click', (e) => {
			e.preventDefault();
			this.events.emit('success:close');
		})
	};

	protected set totalPrice(value: number) {
		this.setText(this.description, `Списано ${value} синапсов`);
	};
}
