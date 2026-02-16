import './scss/styles.scss';

import { IProduct, IProductResponse } from './types/index';
import { ProductCatalog } from './components/models/ProductModel'
import { Basket } from './components/models/BasketModel'
import { Buyer } from './components/models/BuyerModel'
import { Api } from './components/base/Api'
import { ApiComposition } from './components/base/LarekApi'
import { API_URL } from './utils/constants'
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

events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
});

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

const gallery = new Gallery(templates.galleryContainer);
const modal = new Modal(templates.modalContainer, events);
const basketView = new BasketView(cloneTemplate(templates.basket), events);
const header = new Header(events, templates.headerContainer);

const basketModel = new Basket([], events);
const buyerModel = new Buyer({
    payment: '',
    email: '',
    phone: '',
    address: ''
}, events);

const orderForm = new FormOrder(cloneTemplate(templates.order), events);
const contactsForm = new FormContacts(cloneTemplate(templates.contacts), events);
const successView = new OrderSuccess(cloneTemplate(templates.success), events);

let productCatalog: ProductCatalog = new ProductCatalog([], events); 

(async function initCatalog() {
    const apiResponse = await new ApiComposition(new Api(API_URL)).get<IProductResponse>('products.json');
    productCatalog.setArrayProducts(apiResponse.items);
})();

function updateUI() {
    updateBasketCounter();
    updateBasketView();
}

function updateBasketCounter() {
    header.counter = basketModel.getItemsCount();
}

function updateBasketView() {
    const basketProducts = basketModel.getArrayBasket();
    const totalPrice = basketModel.getTotalPrice() || 0;
    
    basketView.price = totalPrice;
    
    const basketItems = basketProducts.map((item, index) => {
        const basketCard = new CardBasket(cloneTemplate(templates.cardBasket), {
            onClick: () => events.emit('basket:item:delete', item)
        });
        return basketCard.render({...item, index: index + 1});
    });
    
    basketView.products = basketItems;
}


events.on('products:changed', () => {
    if (!productCatalog) return;
    
    const productsArray = productCatalog.getArrayProducts();
    const itemCards = productsArray.map((item) => {
        const card = new CardCatalog(cloneTemplate(templates.cardCatalog), {
            onClick: () => events.emit('card:click', item), 
        });
        return card.render(item);
    });
    gallery.catalog = itemCards;
});

events.on('card:click', (item: IProduct) => {
    productCatalog.setProductForDisplay(item);
    
    const previewCard = new CardPreview(cloneTemplate(templates.preview), {
        onClick: () => events.emit('preview:button:click', item)
    });
    
    const cardElement = previewCard.render(item);

    modal.openWithContent(cardElement);
});

events.on('preview:button:click', (item: IProduct) => {
    if (basketModel.hasProduct(item.id)) {
        basketModel.delProduct(item.id);
    } else {
        basketModel.addProduct(item);
    }
    events.emit('modal:close');
});

events.on('basket:item:delete', (item: IProduct) => {
    basketModel.delProduct(item.id);
});

events.on('basket:product:added', updateUI);
events.on('basket:product:removed', updateUI);
events.on('basket:cleared', updateUI);

events.on('basket:open', () => {
    modal.openWithContent(basketView.render());
});

events.on('order:open', () => {
     if (basketModel.getItemsCount() > 0) {
        const buyerData = buyerModel.getBuyerData();
        orderForm.payment = buyerData.payment;
        orderForm.address = buyerData.address;
        
        modal.openWithContent(orderForm.render());
    }
});

events.on('order:payment:change', (data: { payment: 'card' | 'cash' }) => {
  buyerModel.saveOrderData({ ...buyerModel.getBuyerData(), payment: data.payment });
  orderForm.payment = data.payment;

  validateOrderForm();
});

events.on('order:address:change', (data: { address: string }) => {
  buyerModel.saveOrderData({ ...buyerModel.getBuyerData(), address: data.address });
  orderForm.address = data.address;

  validateOrderForm();
});

events.on('contacts:open', () => {
    const buyerData = buyerModel.getBuyerData();
    contactsForm.email = buyerData.email;
    contactsForm.phone = buyerData.phone;
    
    const contactsElement = contactsForm.render();
    modal.content = contactsElement;
    validateContactsForm();
});

events.on('contacts:input:change', (data: { email?: string; phone?: string }) => {
    const currentData = buyerModel.getBuyerData();
    buyerModel.saveOrderData({ ...currentData, ...data });
    
    const contactsElement = contactsForm.render();
    modal.content = contactsElement;
    validateContactsForm();
});

events.on('order:form:submit', () => {
    if (validateOrderForm()) {
        events.emit('contacts:open');
    }
});

events.on('contacts:form:submit', async () => {
    if (validateContactsForm()) {
        await submitOrder();
    }
});

async function submitOrder() {
    try {
        const buyerData = buyerModel.getBuyerData();
        const orderPayload = {
            payment: buyerData.payment,
            address: buyerData.address,
            email: buyerData.email,
            phone: buyerData.phone,
            items: basketModel.getArrayBasket().map(item => item.id),
            total: basketModel.getTotalPrice()
        };
        
        const api = new ApiComposition(new Api(API_URL));
        const response = await api.post('/order', orderPayload);
        events.emit('order:success', response);
        
    } catch (error) {
        console.error('Ошибка при оформлении заказа:', error);
        const contactsElement = contactsForm.render();
        contactsForm.errors = 'Произошла ошибка при оформлении заказа. Попробуйте еще раз.';
        modal.content = contactsElement;
    }
}

events.on('order:success', (response: any) => {
    basketModel.clearBasket();
    buyerModel.clearBuyerData();
    
    successView.price = `Списано ${response?.total || 0} синапсов`;
    modal.content = successView.render();
    templates.modalContainer.classList.add('modal_active');
});

events.on('success:close', () => {
    modal.close();
});

events.on('modal:close', () => {
     modal.close();
});

templates.modalContainer.addEventListener('click', (event) => {
    if (event.target === templates.modalContainer) {
        events.emit('modal:close');
    }
});

function validateOrderForm(): boolean {
    const validationResult = buyerModel.validateOrder();
    orderForm.valid = validationResult.isValid;
    orderForm.errors = validationResult.errors.join('; ');
    return validationResult.isValid;
}

function validateContactsForm(): boolean {
    const validationResult = buyerModel.validateContacts();
    contactsForm.valid = validationResult.isValid;
    contactsForm.errors = validationResult.errors.join('; ');
    return validationResult.isValid;
}

updateUI();
