import { Form } from '../common/Form';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';

interface IContactsOrder {
	email: string;
	phone: string;
}

export class FormContacts extends Form<IContactsOrder> {
	protected email: HTMLInputElement;
	protected phone: HTMLInputElement;
	protected button: HTMLButtonElement;
	protected errorSpan: HTMLSpanElement;

	constructor(container: HTMLFormElement, protected events: IEvents) {
		super(container, events);

		this.form = container;

		this.email = ensureElement<HTMLInputElement>('input[name="email"]',container);
		this.phone = ensureElement<HTMLInputElement>('input[name="phone"]', container);
		this.button = ensureElement<HTMLButtonElement>('.button', container);
		this.errorSpan = ensureElement<HTMLSpanElement>('.form__errors', container);

		this.button.addEventListener('click', (e) => {
			e.preventDefault();
			this.events.emit('form-contacts:send-order');
		})

		this.form.addEventListener('input', (e: Event) => {
			const target = e.target as HTMLInputElement;
			const field = target.name as keyof IContactsOrder;
			const value = target.value;
			this.onInputChange(field as keyof IContactsOrder, value);
		});
	}

	protected onInputChange(field: keyof IContactsOrder, value: string) {
		this.events.emit(`${this.form.name}.${String(field)}:change`, {
			field,
			value,
			formType: 'contacts'
		});
	};
}