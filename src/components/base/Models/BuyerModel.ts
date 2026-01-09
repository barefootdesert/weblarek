// components/model/BuyerModel.ts
import { IBuyer, TPayment, FormErrors } from "../../types";
import { IEvents } from "../base/Events";

export class BuyerModel {
  private payment: TPayment = null;
  private email = "";
  private phone = "";
  private address = "";

  constructor(protected events: IEvents) {}

  // Установка данных с частичным обновлением
  setData(field: keyof IBuyer, value: string): void {
    if (field === 'payment') {
        this.payment = value as TPayment;
    } else {
        (this as any)[field] = value;
    }
    
    // При каждом изменении проверяем валидность
    this.validate();
  }

  // Получить собранный объект заказа (часть данных)
  getData(): IBuyer {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address,
    };
  }

  clear(): void {
    this.payment = null;
    this.email = "";
    this.phone = "";
    this.address = "";
  }

  validate(): boolean {
    const errors: FormErrors = {};
    
    // Валидация этапа "Адрес и оплата"
    if (!this.payment) {
      errors.payment = "Не выбран способ оплаты";
    }
    if (!this.address) {
      errors.address = "Введите адрес доставки";
    }

    // Валидация этапа "Контакты"
    // (в реальном приложении можно разделить на два метода)
    if (!this.email) {
      errors.email = "Введите email";
    }
    if (!this.phone) {
      errors.phone = "Введите телефон";
    }

    // Сообщаем об изменении состояния валидации
    this.events.emit('formErrors:change', errors);

    // Возвращаем true, если ошибок нет
    return Object.keys(errors).length === 0;
  }
}