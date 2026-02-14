import { Form } from '../common/Form';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

interface IFormOrder {
	payment: 'card' | 'cash';
	address: string;
}

export class FormOrder extends Form<IFormOrder> {

	protected cash: HTMLButtonElement;
	protected card: HTMLButtonElement;
	protected address: HTMLInputElement;
	protected button: HTMLButtonElement;
	protected errorSpan: HTMLSpanElement;

	constructor(container: HTMLFormElement, protected events: IEvents) {
		super(container, events);

		this.form = container;

		this.cash = ensureElement<HTMLButtonElement>('button[name="cash"]', container);
		this.card = ensureElement<HTMLButtonElement>('button[name="card"]', container);
		this.address = ensureElement<HTMLInputElement>('input[name="address"]', container);
		this.button = ensureElement<HTMLButtonElement>('.order__button', container);
		this.errorSpan = ensureElement<HTMLSpanElement>('.form__errors', container);

		this.form.addEventListener('input', (e: Event) => {
			const target = e.target as HTMLInputElement;
			const field = target.name as keyof IFormOrder;
			const value = target.value;
			this.onInputChange(field as keyof IFormOrder, value);
		});

		this.button.addEventListener('click', (e) => {
			e.preventDefault();
			this.events.emit('form-order:next');
		});

		this.cash.addEventListener('click', () => {
			this.events.emit(`${this.form.name}.payment:change`, {
				field: 'payment',
				value: 'cash',
				formType: 'order'
			});
			this.isPayMethod = true;
		});

		this.card.addEventListener('click', () => {
			this.events.emit(`${this.form.name}.payment:change`, {
				field: 'payment',
				value: 'card',
				formType: 'order'
			});
			this.isPayMethod = false;
		});
	};

	protected onInputChange(field: keyof IFormOrder, value: string) {
		this.events.emit(`${this.form.name}.${String(field)}:change`, {
			field,
			value,
			formType: 'order'
		});
	}

	protected set isPayMethod(value: boolean) {
		this.toggleClass(this.cash,'button_alt-active', value )
		this.toggleClass(this.card,'button_alt-active', !value )
	}

	clearIsPayMethod() {
		this.toggleClass(this.cash,'button_alt-active', false)
		this.toggleClass(this.card,'button_alt-active', false)
	};
}