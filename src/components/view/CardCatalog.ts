import { Card } from './Card';
import {IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { categoryClasses } from '../../utils/constants';

export class CardCatalog extends Card {
	protected imageCard: HTMLImageElement;
	protected categoryCard: HTMLElement;
	protected id: string;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container, events);
		this.events = events;

		this.imageCard = ensureElement<HTMLImageElement>('.card__image', container);
		this.categoryCard = ensureElement<HTMLImageElement>('.card__category', container);

		this.container.addEventListener('click', () => {
			if (this.id) {
				this.events.emit('product:select', { id: this.id });
			}
		});
	}

	protected set image(value: string){
		this.setImage(this.imageCard, value)
	};

	protected set category(value: string) {
		this.setText(this.categoryCard, value);
		this.categoryCard.className = `card__category ${categoryClasses[value] ?? ''}`
	};
}