import { IProduct } from "../../types";

export class BasketModel {
  protected _items: Map<string, IProduct> = new Map();

  constructor() {} // Убрали IEvents

  getItems(): IProduct[] {
    return Array.from(this._items.values());
  }

  addItem(item: IProduct): void {
    if (!item.price) return;
    this._items.set(item.id, item);
  }

  removeItem(id: string): void {
    this._items.delete(id);
  }

  clear(): void {
    this._items.clear();
  }

  getTotal(): number {
    let total = 0;
    // Исправлено: обход через values()
    for (const item of this._items.values()) {
        total += (item.price ?? 0);
    }
    return total;
  }

  getCount(): number {
    return this._items.size;
  }
}