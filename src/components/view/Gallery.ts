import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export interface IGalleryData {
		container: HTMLElement
	catalogCard: HTMLElement[]
}
export class Gallery extends Component<IGalleryData> {

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);
	}

	protected set catalogCard (items: HTMLElement[]) {
		this.container.append(...items);
	}
}