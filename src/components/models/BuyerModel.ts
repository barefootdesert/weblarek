import { IBuyer } from '../../types/index';
import { IEvents } from '../base/Events';

export class Buyer {
    private payment: 'card' | 'cash' | '' = '';
    private email: string = '';
    private phone: string = '';
    private address: string = '';

    constructor(initialData: IBuyer, protected events: IEvents) {
        this.saveOrderData(initialData);
    }

    /**
     * Обновление данных покупателя (можно передавать только изменённые поля)
     */
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

    validateOrder(): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];
        
        if (!this.payment) errors.push('Выберите способ оплаты');
        if (!this.address?.trim()) errors.push('Введите адрес доставки');
        
        const isValid = errors.length === 0;
        return { isValid, errors };
    }

    validateContacts(): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];
        
        if (!this.email?.trim()) errors.push('Введите email');
        if (!this.phone?.trim()) errors.push('Введите телефон');
        
        const isValid = errors.length === 0;
        return { isValid, errors };
    }
}