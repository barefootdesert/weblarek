import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export interface IHeaderData {
	counter: number;
}

export class Header extends Component<IHeaderData> {
	protected basketButton: HTMLButtonElement;
	protected counterElement: HTMLElement;
	protected wrapper: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);
		this.basketButton = ensureElement<HTMLButtonElement>('.header__basket', container);
		this.counterElement = ensureElement<HTMLElement>('.header__basket-counter', container);
		this.wrapper = ensureElement<HTMLElement>('.page__wrapper');
		this.basketButton.addEventListener('click', () => {
			events.emit('basket:open');
		});
	};

	protected set counter(value: number) {
		this.setText(this.counterElement, value);
		this.events.emit('basket:update');
	};

	set locked(value: boolean) {
		this.toggleClass(this.wrapper, 'page__wrapper_locked', value);
	};
}