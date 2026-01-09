export type ApiPostMethods = "POST" | "PUT" | "DELETE";

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods
  ): Promise<T>;
}

// Товар из каталога
export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

// Способ оплаты (лучше null, чем пустая строка для отсутствия значения)
export type TPayment = "card" | "cash" | null;

export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

// Заказ теперь наследуется от Покупателя, исключая дублирование
export interface IOrder extends IBuyer {
  items: string[];
  total: number;
}

export interface IOrderResult {
  id: string;
  total: number;
}

// Ошибки валидации форм
export type FormErrors = Partial<Record<keyof IOrder, string>>;

// Ответ от API со списком
export interface IList<T> {
    total: number;
    items: T[];
}