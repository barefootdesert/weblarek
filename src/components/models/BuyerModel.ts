import { IBuyer } from '../../types/index';
import { IEvents } from '../base/Events';

// Тип для объекта ошибок, где ключ — имя поля из IBuyer
export type TFormErrors = Partial<Record<keyof IBuyer, string>>;

export class Buyer {
    private payment: 'card' | 'cash' | '' = '';
    private email: string = '';
    private phone: string = '';
    private address: string = '';

    constructor(protected events: IEvents) {}

    saveOrderData(data: Partial<IBuyer>): void {
        if (data.payment !== undefined) this.payment = data.payment;
        if (data.email !== undefined) this.email = data.email;
        if (data.phone !== undefined) this.phone = data.phone;
        if (data.address !== undefined) this.address = data.address;

        // Сообщаем, что модель изменилась
        this.events.emit('buyer:data:saved');
    }

    getBuyerData(): IBuyer {
        return {
            payment: this.payment,
            email: this.email,
            phone: this.phone,
            address: this.address
        };
    }

    clearBuyerData(): void {
        this.payment = '';
        this.email = '';
        this.phone = '';
        this.address = '';
        this.events.emit('buyer:data:saved');
    }


    validate(): TFormErrors {
        const errors: TFormErrors = {};

        if (!this.payment) {
            errors.payment = 'Выберите способ оплаты';
        }
        if (!this.address?.trim()) {
            errors.address = 'Введите адрес доставки';
        }
        if (!this.email?.trim()) {
            errors.email = 'Введите email';
        }
        if (!this.phone?.trim()) {
            errors.phone = 'Введите номер телефона';
        }

        return errors;
    }
}