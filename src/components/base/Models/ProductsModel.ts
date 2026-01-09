// components/model/ProductsModel.ts
import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class ProductsModel {
  private _items: IProduct[] = [];
  private _selected: IProduct | null = null;

  constructor(protected events: IEvents) {}

  setItems(items: IProduct[]): void {
    this._items = items;
    this.events.emit('items:changed', { items: this._items });
  }

  getItems(): IProduct[] {
    return this._items;
  }

  getItemById(id: string): IProduct | undefined {
    return this._items.find((item) => item.id === id);
  }

  setSelected(item: IProduct): void {
    this._selected = item;
    this.events.emit('preview:changed', item);
  }

  getSelected(): IProduct | null {
    return this._selected;
  }
}