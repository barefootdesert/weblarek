import { Api } from "./Api";
import { IProduct, IOrder, IList, IOrderResult } from "../../types";
import { PRODUCT_URL, ORDER_URL } from "../../utils/constants";

export class LarekApi extends Api {
  readonly cdn: string;

  // Изменяем конструктор, чтобы он принимал только нужные данные
  constructor(cdn: string, baseUrl: string, options?: RequestInit) {
    super(baseUrl, options);
    this.cdn = cdn;
  }

  getProducts(): Promise<IProduct[]> {
    return this.get<IList<IProduct>>(PRODUCT_URL)
      .then((data: IList<IProduct>) =>
        data.items.map((item) => ({
          ...item,
          image: this.cdn + item.image,
        }))
      );
  }

  postOrder(order: IOrder): Promise<IOrderResult> {
    return this.post<IOrderResult>(ORDER_URL, order);
  }
}