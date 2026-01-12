import { IBuyer } from "../../types";

export class BuyerModel {
    protected _data: Partial<IBuyer> = {};

    constructor() {} // Убрали IEvents

    setData(data: Partial<IBuyer>): void {
        this._data = { ...this._data, ...data };
    }

    getData(): Partial<IBuyer> {
        return this._data;
    }

    // Пример простой валидации для тестов
    validate(): Record<string, string> | true {
        const errors: Record<string, string> = {};
        if (!this._data.email) errors.email = "Необходим email";
        if (!this._data.phone) errors.phone = "Необходим телефон";
        if (!this._data.address) errors.address = "Необходим адрес";
        
        return Object.keys(errors).length === 0 ? true : errors;
    }
}