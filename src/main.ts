import './scss/styles.scss';

import { IProduct, IOrderRequest, IOrderResponse, IBuyer } from './types/index';
import { ProductCatalog } from './components/models/ProductModel';
import { Basket } from './components/models/BasketModel';
import { Buyer } from './components/models/BuyerModel';
import { Api } from './components/base/Api';
import { ApiComposition } from './components/base/LarekApi';
import { API_URL } from './utils/constants';
import { CardCatalog } from './components/view/CardCatalog';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Header } from './components/view/Header';
import { Gallery } from './components/view/Gallery';
import { Modal } from './components/view/Modal';
import { OrderSuccess } from './components/view/Success';
import { EventEmitter } from './components/base/Events';
import { CardPreview } from './components/view/CardPreview';
import { BasketView } from './components/view/BasketView';
import { CardBasket } from './components/view/CardBasket';
import { FormOrder } from './components/view/FormOrder';
import { FormContacts } from './components/view/FormContacts';

const events = new EventEmitter();
const larekApi = new ApiComposition(new Api(API_URL));

// Инициализация моделей
const productCatalog = new ProductCatalog(events);
const basketModel = new Basket(events);
const buyerModel = new Buyer(events);

// Контейнеры и шаблоны
const templates = {
    headerContainer: ensureElement<HTMLElement>('.header'),
    galleryContainer: ensureElement<HTMLElement>('.page__wrapper'),
    modalContainer: ensureElement<HTMLElement>('.modal'),
    success: ensureElement<HTMLTemplateElement>('#success'),
    cardCatalog: ensureElement<HTMLTemplateElement>('#card-catalog'),
    preview: ensureElement<HTMLTemplateElement>('#card-preview'),
    cardBasket: ensureElement<HTMLTemplateElement>('#card-basket'),
    basket: ensureElement<HTMLTemplateElement>('#basket'),
    order: ensureElement<HTMLTemplateElement>('#order'),
    contacts: ensureElement<HTMLTemplateElement>('#contacts')
};

// Инициализация представлений
const gallery = new Gallery(templates.galleryContainer);
const modal = new Modal(templates.modalContainer, events);
const header = new Header(events, templates.headerContainer);
const basketView = new BasketView(cloneTemplate(templates.basket), events);
const orderForm = new FormOrder(cloneTemplate(templates.order), events);
const contactsForm = new FormContacts(cloneTemplate(templates.contacts), events);
const successView = new OrderSuccess(cloneTemplate(templates.success), events);
const previewCard = new CardPreview(cloneTemplate(templates.preview), {
    onClick: () => events.emit('preview:button:click')
});

/**
 * Инициализация данных
 */
larekApi.getProducts()
    .then(res => productCatalog.setArrayProducts(res.items))
    .catch(err => console.error(err));

/**
 * Логика каталога
 */
events.on('products:changed', () => {
    gallery.catalog = productCatalog.getArrayProducts().map(item => {
        const card = new CardCatalog(cloneTemplate(templates.cardCatalog), {
            onClick: () => events.emit('card:click', item)
        });
        return card.render(item);
    });
});

events.on('card:click', (item: IProduct) => productCatalog.setSelectedProduct(item));

events.on('product:selected', (item: IProduct) => {
    previewCard.updateButtonState(basketModel.hasProduct(item.id), item.price !== null);
    modal.openWithContent(previewCard.render(item));
});

events.on('preview:button:click', () => {
    const item = productCatalog.getSelectedProduct();
    if (item) {
        basketModel.hasProduct(item.id) ? basketModel.delProduct(item.id) : basketModel.addProduct(item);
        modal.close();
    }
});

/**
 * Логика корзины
 */
const updateBasketUI = () => {
    header.counter = basketModel.getItemsCount();
    basketView.price = basketModel.getTotalPrice();
    basketView.products = basketModel.getArrayBasket().map((item, idx) => {
        const card = new CardBasket(cloneTemplate(templates.cardBasket), {
            onClick: () => basketModel.delProduct(item.id)
        });
        return card.render({ ...item, index: idx + 1 });
    });
};

events.on('basket:open', () => {
    updateBasketUI();
    modal.openWithContent(basketView.render());
});

events.on('basket:product:added', updateBasketUI);
events.on('basket:product:removed', updateBasketUI);

/**
 * Формы и Валидация (MVP)
 */

// Просто открываем формы
events.on('order:open', () => modal.openWithContent(orderForm.render()));
events.on('contacts:open', () => modal.openWithContent(contactsForm.render()));

// Сохраняем ввод в модель
events.on('order:payment:change', (data: { payment: 'card' | 'cash' }) => buyerModel.saveOrderData(data));
events.on('order:address:change', (data: { address: string }) => buyerModel.saveOrderData(data));
events.on('contacts:input:change', (data: Partial<IBuyer>) => buyerModel.saveOrderData(data));

// Единая точка синхронизации данных и ошибок
events.on('buyer:data:saved', () => {
    const data = buyerModel.getBuyerData();
    const allErrors = buyerModel.validate(); // Твой новый универсальный метод

    // Синхронизируем форму заказа (Способ оплаты + Адрес)
    orderForm.payment = data.payment;
    orderForm.address = data.address;
    // Показываем только те ошибки, которые относятся к этой форме
    const orderErrors = [allErrors.payment, allErrors.address].filter(Boolean);
    orderForm.valid = !allErrors.payment && !allErrors.address;
    orderForm.errors = orderErrors.join('; ');

    // Синхронизируем форму контактов (Email + Телефон)
    contactsForm.email = data.email;
    contactsForm.phone = data.phone;
    // Показываем только те ошибки, которые относятся к этой форме
    const contactErrors = [allErrors.email, allErrors.phone].filter(Boolean);
    contactsForm.valid = !allErrors.email && !allErrors.phone;
    contactsForm.errors = contactErrors.join('; ');
});

events.on('order:form:submit', () => events.emit('contacts:open'));
events.on('contacts:form:submit', () => submitOrder());

/**
 * Отправка заказа
 */
async function submitOrder() {
    const buyerData = buyerModel.getBuyerData();
    // ФИКС: API не принимает товары с ценой null (бесценные)
    const validItems = basketModel.getArrayBasket().filter(item => item.price !== null);

    const orderPayload: IOrderRequest = {
        payment: buyerData.payment as 'card' | 'cash',
        address: buyerData.address,
        email: buyerData.email,
        phone: buyerData.phone,
        items: validItems.map(item => item.id),
        total: basketModel.getTotalPrice()
    };

    try {
        const response = await larekApi.postOrder(orderPayload);
        events.emit('order:success', response);
    } catch (error) {
        console.error('Ошибка сервера:', error);
        contactsForm.errors = 'Ошибка сервера. Попробуйте оформить заказ позже.';
    }
}

/**
 * Успешное завершение
 */
events.on('order:success', (response: IOrderResponse) => {
    basketModel.clearBasket();
    buyerModel.clearBuyerData();
    successView.price = `Списано ${response.total} синапсов`;
    modal.openWithContent(successView.render());
});

events.on('success:close', () => modal.close());

// Первичный апдейт интерфейса
updateBasketUI();