import { IBuyer } from '../../types/index';
import { IEvents } from '../base/Events';

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

        this.events.emit('buyer:data:saved', {
            newData: this.getBuyerData()
        });
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

        this.events.emit('buyer:data:cleared', {
            newData: this.getBuyerData()
        });
    }

    /**
     * Универсальный метод validate() — обязательный по ревью
     */
    validate(): Partial<Record<keyof IBuyer, string>> {
        const errors: Partial<Record<keyof IBuyer, string>> = {};

        if (!this.payment) errors.payment = 'Выберите способ оплаты';
        if (!this.address?.trim()) errors.address = 'Введите адрес доставки';
        if (!this.email?.trim()) errors.email = 'Введите email';
        if (!this.phone?.trim()) errors.phone = 'Введите телефон';

        return errors;
    }
}