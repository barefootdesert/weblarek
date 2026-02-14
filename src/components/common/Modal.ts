import {ensureElement} from "../../utils/utils";
import { IEvents } from '../base/Events';
import { Component } from '../base/Component';

interface IModalData {
	content: HTMLElement;
}

export class Modal extends Component<IModalData> {
	protected closeButton: HTMLButtonElement;
	protected contentModal: HTMLElement;


	private  readonly handleEscKey: (event: KeyboardEvent) => void;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);
		this.events = events;

		this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
		this.contentModal = ensureElement<HTMLElement>('.modal__content', container);

		this.handleEscKey = this.handleEscKeyBind.bind(this);

		this.closeButton.addEventListener('click', () => {
			this.close();
			});

		this.container.addEventListener('click', (event) => {
			if (event.target === this.container) {
				this.close();
			}
		});
	};

	set content(value: HTMLElement) {
		this.contentModal.replaceChildren(value)
	};

	open (): void {
		this.toggleClass(this.container, 'modal_active', true)
		document.addEventListener('keydown', this.handleEscKey);
		this.events.emit('modal:open');
	}

	close (): void {
		this.toggleClass(this.container, 'modal_active', false)
		document.removeEventListener('keydown', this.handleEscKey);
		this.events.emit('modal:close');
	};

	private handleEscKeyBind(event: KeyboardEvent): void {
		if (event.key === 'Escape') {
			this.close();
		}
	};
}


