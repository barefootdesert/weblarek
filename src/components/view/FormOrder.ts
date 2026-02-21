import { IBuyer } from "../../types";
import { ensureAllElements, ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Form, TForm } from "./Form";

type TFormOrder = TForm & Pick<IBuyer, 'payment' | 'address'>;

export class FormOrder extends Form<TFormOrder> {
    protected buttonsForm: HTMLButtonElement[];
    protected inputElement: HTMLInputElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container, events);

        this.buttonsForm = ensureAllElements<HTMLButtonElement>('.button_alt', this.container);
        this.inputElement = ensureElement<HTMLInputElement>('.form__input', this.container);

        // Клик по кнопкам оплаты
        this.buttonsForm.forEach(button => {
            button.addEventListener('click', () => {
                this.events.emit('order:payment:change', { 
                    payment: button.name as 'card' | 'cash' 
                });
            });
        });

        // Ввод адреса
        this.inputElement.addEventListener('input', () => {
            this.events.emit('order:address:change', { 
                address: this.inputElement.value 
            });
        });
    }

    set payment(value: 'card' | 'cash' | '') {
        this.buttonsForm.forEach(button => {
            button.classList.toggle('button_alt-active', button.name === value);
        });
    }

    set address(value: string) {
        this.inputElement.value = value || '';
    }
}