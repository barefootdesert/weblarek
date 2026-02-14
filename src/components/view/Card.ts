import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { IProduct } from '../../types/types';
import { categoryClasses } from '../../utils/constants';

interface ICard extends IProduct {
	buttonText: string;
	index: number;
	TotalPrice: number;
}

export class Card extends Component<ICard> {
	protected cardTitle: HTMLElement;
	protected cardPrice: HTMLElement;
	protected events: IEvents;
	protected id: string;
	protected categoryCard: HTMLElement;
	protected imageCard: HTMLImageElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;

		this.cardTitle = ensureElement<HTMLElement>('.card__title', container);
		this.cardPrice = ensureElement<HTMLElement>('.card__price', container);

	};

	protected set title(value: string) {
		this.setText(this.cardTitle, value);
	};

	protected set price(value: number | null) {
	 this.setText(this.cardPrice, value === null ? `Бессцено` : `${value} синапсов`);
 };
}