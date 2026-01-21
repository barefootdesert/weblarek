import "./scss/styles.scss";
import { LarekApi } from "./components/base/LarekApi";
import { ProductsModel } from "./components/models/ProductsModel";
import { BasketModel } from "./components/models/BasketModel";
import { BuyerModel } from "./components/models/BuyerModel";
import { apiProducts } from "./utils/data";
import { API_URL, CDN_URL } from "./utils/constants";

// Инициализация API
const larekApi = new LarekApi(CDN_URL, API_URL);

// --- Тестирование ProductsModel ---
console.group('--- Тестирование ProductsModel ---');
const productsModel = new ProductsModel();

// 1. Загрузка товаров
productsModel.setItems(apiProducts.items);
console.log("1. Все товары:", productsModel.getItems());

// 2. Поиск
console.log("2. Поиск по ID:", productsModel.getProduct(apiProducts.items[0].id));

// 3. [ИСПРАВЛЕНО] Проверка метода setSelected
productsModel.setSelected(apiProducts.items[0]);
console.log("3. Выбранный товар (setSelected):", productsModel.getSelected());
console.groupEnd();


// --- Тестирование BasketModel ---
console.group('--- Тестирование BasketModel ---');
const basketModel = new BasketModel();

// Добавляем товар
basketModel.addItem(apiProducts.items[0]);
console.log("4. Стоимость корзины:", basketModel.getTotal());

// 5. [ИСПРАВЛЕНО] Вывод списка покупок, когда в корзине есть товары
console.log("5. Товары в корзине:", basketModel.getItems());

// Удаление товара
basketModel.removeItem(apiProducts.items[0].id);
console.log("6. Корзина после удаления:", basketModel.getItems());

// Добавляем снова, чтобы проверить очистку
basketModel.addItem(apiProducts.items[1]);
console.log("7. Добавили товар перед очисткой (Total):", basketModel.getTotal());

// 8. [ИСПРАВЛЕНО] Очистка данных и вывод в консоль после этого
basketModel.clear();
console.log("8. Корзина после очистки (items):", basketModel.getItems());
console.log("9. Корзина после очистки (count):", basketModel.getCount());
console.groupEnd();


// --- Тестирование BuyerModel ---
console.group('--- Тестирование BuyerModel ---');
const buyerModel = new BuyerModel();

// Частичные данные
buyerModel.setData({ email: "test@test.com" });
console.log("10. Частичная валидация:", buyerModel.validate());

// Полные данные
buyerModel.setData({ phone: "+79990000000", address: "Street", payment: "card" });

// 11. [ИСПРАВЛЕНО] Вывод заполненных данных в консоль
console.log("11. Заполненные данные покупателя:", buyerModel.getData());

console.log("12. Полная валидация:", buyerModel.validate());
console.groupEnd();


// --- Проверка связи с реальным API ---
console.group('--- API ---');
larekApi.getProducts()
  .then((items) => {
    productsModel.setItems(items);
    console.log("Каталог успешно загружен с сервера:", items);
  })
  .catch((err) => {
    console.error("Ошибка при работе с API:", err);
  })
  .finally(() => {
      console.groupEnd();
  });