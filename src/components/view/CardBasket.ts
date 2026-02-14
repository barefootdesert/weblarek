import { Card } from './Card';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export class CardBasket extends Card  {

	protected indexCard: HTMLElement;
	protected deleteButton: HTMLButtonElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container, events);

		this.indexCard = ensureElement<HTMLElement>('.basket__item-index', container)
		this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', container);

		this.deleteButton.addEventListener('click', () => {
			this.events.emit('basket-card:delete',  { id: this.id });
		})
	}

	protected set index(value: number) {
		this.setText(this.indexCard, value);
	};
}