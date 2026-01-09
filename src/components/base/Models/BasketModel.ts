// components/model/BasketModel.ts
import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class BasketModel {
  // Map для быстрого поиска и удаления: ID -> Товар
  private _items: Map<string, IProduct> = new Map();

  constructor(protected events: IEvents) {}

  // Получить все товары массивом
  getItems(): IProduct[] {
    return Array.from(this._items.values());
  }

  // Добавить товар (если есть цена и его еще нет в корзине)
  addItem(item: IProduct): void {
    if (!item.price) {
        console.warn("Нельзя добавить в корзину товар без цены");
        return;
    }
    if (!this._items.has(item.id)) {
      this._items.set(item.id, item);
      this._notify();
    }
  }

  // Удалить товар
  removeItem(id: string): void {
    if (this._items.delete(id)) {
      this._notify();
    }
  }

  // Очистить корзину
  clear(): void {
    this._items.clear();
    this._notify();
  }

  // Получить общую стоимость
  getTotal(): number {
    let total = 0;
    this._items.forEach(item => total += (item.price ?? 0));
    return total;
  }

  // Получить количество товаров
  getCount(): number {
    return this._items.size;
  }

  // Проверить наличие
  hasItem(id: string): boolean {
    return this._items.has(id);
  }

  // Уведомить подписчиков об изменении корзины
  private _notify() {
    this.events.emit('basket:changed', { 
        items: this.getItems(), 
        total: this.getTotal() 
    });
  }
}