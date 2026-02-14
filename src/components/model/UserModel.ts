import { IEvents } from '../base/Events';
import { IUserData } from '../../types/types';

interface IUserModel {
	setField<T extends keyof IUserData>(field: T, value: IUserData[T]): void;
	validateAll(): {valid: boolean};
	resetData(): void;
	getUserData(): IUserData;
}

export class UserModel implements IUserModel {
	private userData: IUserData = {
		payment: null,
		email: '',
		phone: '',
		address: ''
	};

	constructor(protected events: IEvents) {};

	setField<T extends keyof IUserData>(field: T, value: IUserData[T]) {
		this.userData[field] = value;

		this.events.emit('user:update', {field})
	}

	validateAll() {
		const errors: Record<'order' | 'contacts', Record<string, string>> = {
			order: {},
			contacts: {}
		};
		let valid = true;

		if (!this.userData.address.trim()) {
			errors.order.address = 'Необходимо указать адрес';
			valid = false;
		}
		if (!this.userData.payment) {
			valid = false;
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(this.userData.email)) {
			errors.contacts.email = '';
			valid = false;
		}
		if (!this.userData.phone.trim()) {
			errors.contacts.phone = '';
			valid = false;
		}

		return { valid, errors };
	}

	resetData() {
		this.userData = {
			payment: null,
			email: '',
			phone: '',
			address: ''
		};
	};

	getUserData() {
		return this.userData;
	};
}