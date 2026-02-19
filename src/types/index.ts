export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export type apiОbject = IProduct | IBuyer;

export type TPayment = 'card' | 'cash' | '';

export interface IPayment {
    payment: TPayment;
}

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export interface IBuyer {
    payment: 'card' | 'cash' | '';
    email: string;
    phone: string;
    address: string;
}

export interface IOrderRequest extends IBuyer {
    items: string[]; 
    total: number;   
}

export interface IOrderResponse {
    id?: string;      
    total: number;  
}

export interface ICardActions {
  onClick: (event: MouseEvent) => void;
}

export interface IProductResponse {
  items: IProduct[];
}