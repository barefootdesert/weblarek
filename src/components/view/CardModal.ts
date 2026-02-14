import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { categoryClasses } from '../../utils/constants';
import { Card } from './Card';

export class CardModal extends Card {

protected buyCardButton: HTMLButtonElement;
protected descriptionCard: HTMLElement;
protected categoryCard: HTMLElement;
protected imageCard: HTMLImageElement;


	constructor(container: HTMLElement, events: IEvents) {
		super(container, events);

		this.descriptionCard = ensureElement<HTMLElement>('.card__text', container);
		this.categoryCard = ensureElement<HTMLElement>('.card__category', container);
		this.imageCard = ensureElement<HTMLImageElement>('.card__image', container);
		this.buyCardButton = ensureElement<HTMLButtonElement>('.card__button', container);

		this.buyCardButton.addEventListener('click', () => {
			this.events.emit('modal-card:toggle-product', { id: this.id });
		});
	};

	protected set description(value: string) {
		this.setText(this.descriptionCard, value);
	};

	protected set image(value: string){
		this.setImage(this.imageCard, value)
	};

	protected set buttonText (value:  string) {
		this.setText(this.buyCardButton, value);
	};

	protected set price(value: number | null) {
		super.price = value;

		if (value === null) {
			this.setDisabled(this.buyCardButton, true)
		} else {
			this.setDisabled(this.buyCardButton, false)
		}
	};
}