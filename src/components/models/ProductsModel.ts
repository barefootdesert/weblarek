import { IProduct } from "../../types";

export class ProductsModel {
    protected _items: IProduct[] = [];
    public selected: IProduct | null = null; // Поле для хранения выбранного товара

    // Конструктор теперь не принимает аргументов
    constructor() {}

    setItems(items: IProduct[]): void {
        this._items = items;
    }

    getItems(): IProduct[] {
        return this._items;
    }

    // Метод поиска товара по ID для тестов в main
    getProduct(id: string): IProduct | undefined {
        return this._items.find((item) => item.id === id);
    }

    // Метод для установки выбранного товара (превью)
    setSelected(item: IProduct | null): void {
        this.selected = item;
    }

    // Метод для получения текущего выбранного товара
    getSelected(): IProduct | null {
        return this.selected;
    }
}