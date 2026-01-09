import "./scss/styles.scss";

import { Api } from "./components/base/Api";
import { LarekApi } from "./components/base/LarekApi";

import { ProductsModel } from "./components/base/Models/ProductsModel";
import { BasketModel } from "./components/base/Models/BasketModel";
import { BuyerModel } from "./components/base/Models/BuyerModel";

import { apiProducts } from "./utils/data";
import { API_URL } from "./utils/constants";

const api = new Api(API_URL);

const productsModel = new ProductsModel();
productsModel.setItems(apiProducts.items);

console.log("Каталог (локально):", productsModel.getItems());

const basketModel = new BasketModel();
basketModel.addItem(apiProducts.items[0]);

console.log("Корзина:", basketModel.getItems());

const buyerModel = new BuyerModel();
buyerModel.setData({ email: "test@test.com" });

console.log("Покупатель:", buyerModel.getData());
console.log("Ошибки:", buyerModel.validate());

const larekApi = new LarekApi(api);

larekApi.getProducts().then((items) => {
  productsModel.setItems(items);
  console.log("Каталог (сервер):", productsModel.getItems());
});
