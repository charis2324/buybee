// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	interface Locals {
		userToken: string | undefined

	}
	// interface PageData {}
	// interface Error {}
	// interface Platform {}
}
interface CategoryHierarchy {
	main_categories: MainCategory[];
}
interface MainCategory {
	main_category_id: number;
	main_category_name: string;
	sub_categories: SubCategory[];
}
interface SubCategory {
	sub_category_id: number;
	sub_category_name: string;
	side_categories: { id: number; name: string }[];
}
interface SideCategory {
	id: number;
	name: string;
	sub_category_id: number;
	sub_category_name: string;
	main_category_id: number;
	main_category_name: string;
}
interface Product {
	id: number;
	product_name: string;
	selling_price: number;
	about_product?: string;
	product_specification?: string;
	shipping_weight: number;
	main_category_id: number;
	sub_category_id: number;
	side_category_id: number;
}
interface GroupedProducts {
	[key: number]: Omit<Product, 'category_id'>[];
}
interface User {
	firstName: string;
	lastName: string;
	username: string;
	email: string;
	password: string;
	phoneNumber: string;
	address: string;
}
interface passwordResult {
	password: string;
}
interface idResult {
	id: number;
}
interface CartItem {
	product_id: number;
	product_name: string;
	selling_price: number;
	quantity: number;
}
interface ShoppingCart {
	cartItems: cartItem[];
}
interface CartExists {
	id: number
}
interface TokenPayload {
	userId: number
}
interface CountResult {
	count: number
}
interface ShoppingCartRow {
	id: number;
	user_id: number;
}

interface ShoppingCartItemRow {
	id: number;
	cart_id: number;
	product_id: number;
	quantity: number;
}