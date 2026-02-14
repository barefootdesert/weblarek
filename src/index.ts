import './scss/styles.scss';
import  './components/base/api';

import { AppApi } from './components/LarekApi';
import { API_URL, CDN_URL } from './utils/constants';
import { IProduct, IUserData } from './types/types';
import { EventEmitter } from './components/base/Events';
import { cloneTemplate, ensureElement } from './utils/utils';
import { ProductsModel } from './components/model/ProductsModel';
import { Card } from './components/view/Card';
import { Gallery } from './components/view/Gallery';
import { CardCatalog } from './components/view/CardCatalog';
import { Modal } from './components/common/Modal';
import { CardModal } from './components/view/CardModal';
import { Basket } from './components/view/Basket';
import { Header } from './components/view/Header';
import { BasketData } from './components/model/BasketData';
import { CardBasket } from './components/view/CardBasket';
import { FormOrder } from './components/view/FormOrder';
import { FormContacts } from './components/view/FormContacts';
import { UserModel } from './components/model/UserModel';
import { Success } from './components/view/Success';


const galleryContainer = ensureElement<HTMLElement>('.gallery');

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');

const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');

const formOrderTemplate = ensureElement<HTMLTemplateElement>('#order');
const formContactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const headerContainer = ensureElement<HTMLElement>('.header')
const api = new AppApi(CDN_URL, API_URL);
const events = new EventEmitter();

const productsModel = new ProductsModel(events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const cardModal = new CardModal(cloneTemplate(cardPreviewTemplate), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const header = new Header(headerContainer, events)
const basketData = new BasketData(events);
const userModel = new UserModel(events);

const formOrder = new FormOrder(cloneTemplate(formOrderTemplate), events)
const formContacts = new FormContacts(cloneTemplate(formContactsTemplate), events)

const gallery = new Gallery(galleryContainer, events);

api.fillCatalogy()
	.then((product: IProduct[]) => {
	const pngProduct = product.map(svgProduct => {
		return {
			...svgProduct,
			image: svgProduct.image.replace('svg', 'png')
		}
	})
		console.log('сохраняю:', product)
		productsModel.setProducts(pngProduct);
	})
	.catch((err) => {
		console.log(err, 'ошибка сохранения')
	})

events.on('modal:open', () => {
	header.locked = true;
});

events.on('modal:close', () => {
	header.locked = false;
});

events.on('form-contacts:send-order', () => {

	const success = new Success(cloneTemplate(successTemplate), events)
	const userData = userModel.getUserData()
	const productsTotalPrice = basketData.getTotal()
	const productItemList = basketData.getItemsList()
	const productsId = productItemList.map((product) => product.id)

	const order = {
		...userData,
		total: productsTotalPrice,
		items: productsId,
	}

	api.sendOrder(order)
		.then((result)=> {

			const successRender = success.render({totalPrice: result.total})
			modal.render({content: successRender})

			basketData.clearBasket()
			formContacts.reset()
			formContacts.render({
				valid: false,
				errors: [],
			})

			userModel.resetData()

			formOrder.clearIsPayMethod()
			formOrder.reset()
			formOrder.render({
				valid: false,
				errors: [],
			})

			return result
		})
		.catch(console.error)
})

events.on(/^order\..*:change|^contacts\..*:change/,
	(data: { field: keyof IUserData; value: string | 'card' | 'cash' | null; formType: 'order' | 'contacts' }) => {
		userModel.setField(data.field, data.value);
	}
);

events.on('user:update', (data: {field: string}) => {

	const validation = userModel.validateAll();

if (data.field === 'address' || data.field === 'payment') {

	const userData = userModel.getUserData();

	const isOrderValid = userData.address.trim() !== '' && userData.payment !== null;

	formOrder.render({
		valid: isOrderValid,
		errors: Object.values(validation.errors.order),
	});

} if (data.field === 'phone' || data.field === 'email') {

	const contactErrors = Object.values(validation.errors.contacts).filter(Boolean);

	formContacts.render({
		valid: Object.keys(validation.errors.contacts).length === 0,
		errors: contactErrors,
	});
}
});

events.on('success:close', () => {
	modal.close();
});

events.on('products:changed', () => {

	const products: IProduct[] = productsModel.getCatalog()

	console.log(products)

	const newArray = products.map((product) => {

		const cardCatalog = new CardCatalog(cloneTemplate(cardCatalogTemplate), events)
		return cardCatalog.render(product)

	})

	gallery.render({catalogCard: newArray})
})

events.on('product:select', (event: {id: string}) => {
	const product =  productsModel.getProductById(event.id)

	let buttonText: string;

	if (product.price === null) {
		buttonText = 'Недоступно'
	} else {
		buttonText = basketData.isInBasket(product)? 'Удалить из корзины' : 'Купить'
	}
	const productRender = cardModal.render
		({
			...product,
			buttonText
		})

	modal.render({ content: productRender })

	modal.open()
})

events.on('basket:open', () => {
	events.emit('basket:updated');
	modal.render({content: basket.render()})
	modal.open()

})

events.on('modal-card:toggle-product', (event: {id: string}) => {
	const product =  productsModel.getProductById(event.id)

	if (basketData.isInBasket(product)) {
		basketData.deleteItem(product.id)
	} else {
		basketData.addItem(product);
	}

	modal.close()
})

events.on('basket-card:delete', (event: {id: string}) => {
	const product =  productsModel.getProductById(event.id)
	basketData.deleteItem(product.id)
})

events.on('basket-submit:next', () => {
const formOrderModal = formOrder.render({content: formOrderTemplate})
	modal.render({content: formOrderModal})
})

events.on('form-order:next', () => {
	const formContactsModal = formContacts.render({content: formContactsTemplate})
	modal.render({content: formContactsModal})
})

events.on('basket:updated', () => {

	basket.clear()
	header.render()

	const totalCount = basketData.getTotalCount()
	header.render({counter: totalCount})

	const newArray = basketData.getItemsList().map((product, index) => {
		const cardBasket = new CardBasket(cloneTemplate(cardBasketTemplate), events)
		return cardBasket.render({
			...product,
			index: index +1,
		})
	});

	const price = basketData.getTotal()

	basket.render({
		renderItemList: newArray,
		totalPrice: price,
	})

	const itemsList = basketData.getItemsList()

	basket.updateButtonState(itemsList.length)

})

