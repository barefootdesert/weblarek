import './scss/styles.scss';

import { IProduct, IOrderRequest } from './types/index';
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

const larekApi = new ApiComposition(new Api(API_URL));
const productCatalog = new ProductCatalog(events); 
const basketModel = new Basket(events);
const buyerModel = new Buyer(events);

const gallery = new Gallery(templates.galleryContainer);
const modal = new Modal(templates.modalContainer, events);
const basketView = new BasketView(cloneTemplate(templates.basket), events);
const header = new Header(events, templates.headerContainer);

const orderForm = new FormOrder(cloneTemplate(templates.order), events);
const contactsForm = new FormContacts(cloneTemplate(templates.contacts), events);
const successView = new OrderSuccess(cloneTemplate(templates.success), events);

// CardPreview — один экземпляр на всё приложение
const previewCard = new CardPreview(cloneTemplate(templates.preview), {
    onClick: () => events.emit('preview:button:click')
});

(async function initCatalog() {
    try {
        const apiResponse = await larekApi.getProducts();
        productCatalog.setArrayProducts(apiResponse.items);
    } catch (error) {
        console.error('Ошибка загрузки каталога:', error);
    }
})();

function updateUI() {
    header.counter = basketModel.getItemsCount();
    updateBasketView();
}

function updateBasketView() {
    const basketProducts = basketModel.getArrayBasket();
    const totalPrice = basketModel.getTotalPrice();

    basketView.price = totalPrice;

    const basketItems = basketProducts.map((item, index) => {
        const basketCard = new CardBasket(cloneTemplate(templates.cardBasket), {
            onClick: () => events.emit('basket:item:delete', item)
        });
        return basketCard.render({ ...item, index: index + 1 });
    });

    basketView.products = basketItems;
}

// ==================== КАТАЛОГ ====================
events.on('products:changed', () => {
    const productsArray = productCatalog.getArrayProducts();
    const itemCards = productsArray.map((item) => {
        const card = new CardCatalog(cloneTemplate(templates.cardCatalog), {
            onClick: () => events.emit('card:click', item),
        });
        return card.render(item);
    });
    gallery.catalog = itemCards;
});

// ==================== ПРЕВЬЮ ====================
events.on('card:click', (item: IProduct) => {
    productCatalog.setSelectedProduct(item);   // только модель!
});

events.on('product:selected', (item: IProduct) => {
    previewCard.updateButtonState(
        basketModel.hasProduct(item.id),
        item.price !== null
    );
    modal.openWithContent(previewCard.render(item));
});

events.on('preview:button:click', () => {
    const currentItem = productCatalog.getSelectedProduct();
    if (!currentItem) return;

    if (basketModel.hasProduct(currentItem.id)) {
        basketModel.delProduct(currentItem.id);
    } else {
        basketModel.addProduct(currentItem);
    }
    modal.close();   // прямой вызов, без события
});

// ==================== КОРЗИНА ====================
events.on('basket:item:delete', (item: IProduct) => {
    basketModel.delProduct(item.id);
});

events.on('basket:product:added', updateUI);
events.on('basket:product:removed', updateUI);
events.on('basket:cleared', updateUI);

events.on('basket:open', () => {
    modal.openWithContent(basketView.render());
});

// ==================== ФОРМЫ (ИСПРАВЛЕНО ПО РЕВЬЮ) ====================

// Ревьюер: Обработчики открытия форм должны только отрендерить формы.
events.on('order:open', () => {
    modal.openWithContent(orderForm.render());
});

events.on('contacts:open', () => {
    modal.openWithContent(contactsForm.render());
});

// Обработка пользовательского ввода
events.on('order:payment:change', (data: { payment: 'card' | 'cash' }) => {
    buyerModel.saveOrderData({ payment: data.payment });
});

events.on('order:address:change', (data: { address: string }) => {
    buyerModel.saveOrderData({ address: data.address });
});

events.on('contacts:input:change', (data: { email?: string; phone?: string }) => {
    buyerModel.saveOrderData(data);
});

// Ревьюер: Синхронизация данных после изменения модели.
// Необходимо заполнить не только ошибки, но и поменять значения полей форм.
events.on('buyer:data:saved', () => {
    const data = buyerModel.getBuyerData();
    const allErrors = buyerModel.validate(); // Ваш новый универсальный метод

    // Синхронизируем значения полей из модели в View
    orderForm.payment = data.payment;
    orderForm.address = data.address;
    contactsForm.email = data.email;
    contactsForm.phone = data.phone;

    // Фильтруем ошибки для формы заказа
    const orderErrors = [allErrors.payment, allErrors.address].filter(Boolean);
    orderForm.valid = !allErrors.payment && !allErrors.address;
    orderForm.errors = orderErrors.join('; ');

    // Фильтруем ошибки для формы контактов
    const contactErrors = [allErrors.email, allErrors.phone].filter(Boolean);
    contactsForm.valid = !allErrors.email && !allErrors.phone;
    contactsForm.errors = contactErrors.join('; ');
});

// Ревьюер: В обработчиках отправки формы не должно производиться валидации данных.
events.on('order:form:submit', () => {
    events.emit('contacts:open');
});

events.on('contacts:form:submit', async () => {
    await submitOrder();
});

async function submitOrder() {
    try {
        const buyerData = buyerModel.getBuyerData();
        const orderPayload: IOrderRequest = {
            payment: buyerData.payment as 'card' | 'cash',
            address: buyerData.address,
            email: buyerData.email,
            phone: buyerData.phone,
            items: basketModel.getArrayBasket().map(item => item.id),
            total: basketModel.getTotalPrice()
        };

        const response = await larekApi.postOrder(orderPayload);
        events.emit('order:success', response);
    } catch (error) {
        console.error('Ошибка оформления:', error);
        contactsForm.errors = 'Произошла ошибка при оформлении заказа. Попробуйте ещё раз.';
    }
}

events.on('order:success', (response: any) => {
    basketModel.clearBasket();
    buyerModel.clearBuyerData();

    successView.price = `Списано ${response?.total || 0} синапсов`;
    modal.openWithContent(successView.render());
});

events.on('success:close', () => {
    modal.close();
});

updateUI();