import "./scss/styles.scss";
import { LarekApi } from "./components/base/LarekApi";
import { ProductsModel } from "./components/models/ProductsModel";
import { BasketModel } from "./components/models/BasketModel";
import { BuyerModel } from "./components/models/BuyerModel";
import { apiProducts } from "./utils/data";
import { API_URL, CDN_URL } from "./utils/constants"; // Добавьте импорт CDN_URL

// Инициализация API
// Исправлено: передаем URL, как того требует конструктор LarekApi
const larekApi = new LarekApi(CDN_URL, API_URL);

// --- Тестирование ProductsModel ---
const productsModel = new ProductsModel();
productsModel.setItems(apiProducts.items);
console.log("1. Все товары:", productsModel.getItems());
console.log("2. Поиск по ID:", productsModel.getProduct(apiProducts.items[0].id));

// --- Тестирование BasketModel ---
const basketModel = new BasketModel();
basketModel.addItem(apiProducts.items[0]);
console.log("3. Стоимость корзины:", basketModel.getTotal());
basketModel.removeItem(apiProducts.items[0].id);
console.log("4. Корзина после удаления:", basketModel.getItems());
basketModel.clear();
console.log("5. Корзина после очистки:", basketModel.getCount());

// --- Тестирование BuyerModel ---
const buyerModel = new BuyerModel();
buyerModel.setData({ email: "test@test.com" });
console.log("6. Частичная валидация:", buyerModel.validate());
buyerModel.setData({ phone: "+79990000000", address: "Street", payment: "card" });
console.log("7. Полная валидация:", buyerModel.validate());

// Загрузка данных с сервера
larekApi.getProducts()
  .then((items) => {
    productsModel.setItems(items);
    console.log("Каталог загружен с сервера");
  })
  .catch((err) => {
    // Исправлено: добавлен блок catch
    console.error("Ошибка при работе с API:", err);
  });