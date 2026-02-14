
import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';

interface IFormState {
	valid: boolean;
	errors: string[];
	content: HTMLTemplateElement;
	isPayMethod: boolean;
	validation?: { valid: boolean; errors: Record<string, string> };
	reset(): void;
}

export class Form<T> extends Component<IFormState> {
	protected form: HTMLFormElement;
	protected submitButton: HTMLButtonElement;
	protected errorSpan: HTMLSpanElement;
	protected inputs: NodeListOf<HTMLInputElement>;

	constructor(container: HTMLFormElement, protected events: IEvents) {
		super(container);
		this.form = container;

		this.inputs = container.querySelectorAll('.form__input');
		this.submitButton = ensureElement<HTMLButtonElement>('button[type=submit]', container);
		this.errorSpan = ensureElement<HTMLSpanElement>('.form__errors', container);


	}

	set valid(value: boolean) {
		this.setDisabled(this.submitButton, !value)
	}

	set errors(value: string) {
		this.setText(this.errorSpan, value);
	}

	reset() {
		this.form.reset();
	};

}





