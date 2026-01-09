import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class BasketModel {
  protected _items: Map<string, IProduct> = new Map();

  constructor(protected events: IEvents) {}

  getItems(): IProduct[] {
    return Array.from(this._items.values());
  }

  addItem(item: IProduct): void {
    if (!item.price) {
        return;
    }
    if (!this._items.has(item.id)) {
      this._items.set(item.id, item);
      this._notify();
    }
  }

  removeItem(id: string): void {
    if (this._items.delete(id)) {
      this._notify();
    }
  }

  clear(): void {
    this._items.clear();
    this._notify();
  }

  getTotal(): number {
    let total = 0;
    this._items.forEach(item => total += (item.price ?? 0));
    return total;
  }

  getCount(): number {
    return this._items.size;
  }

  hasItem(id: string): boolean {
    return this._items.has(id);
  }

  private _notify() {
    this.events.emit('basket:changed', { 
        items: this.getItems(), 
        total: this.getTotal() 
    });
  }
}