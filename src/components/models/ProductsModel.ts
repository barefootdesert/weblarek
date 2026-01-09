import { IProduct } from "../../types";

export class ProductsModel {
  // Все товары каталога
  private items: IProduct[] = [];

  // Выбранный товар для подробного просмотра
  private selected: IProduct | null = null;

  // Сохранить массив товаров
  setItems(items: IProduct[]): void {
    this.items = items;
  }

  // Получить все товары
  getItems(): IProduct[] {
    return this.items;
  }

  // Получить товар по id
  getItemById(id: string): IProduct | undefined {
    return this.items.find((item) => item.id === id);
  }

  // Сохранить выбранный товар
  setSelected(item: IProduct): void {
    this.selected = item;
  }

  // Получить выбранный товар
  getSelected(): IProduct | null {
    return this.selected;
  }
}
