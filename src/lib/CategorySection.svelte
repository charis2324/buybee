<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import ProductCard from './ProductCard.svelte';
	import { cartCount, getCartCount } from './cartCount';

	export let categoryName: string;
	export let categoryId: number;
	export let products: Product[];
	export let showLoadMore: boolean;
	let numOfProducts = 0;
	$: numOfProducts = products.length;
	const dispatch = createEventDispatcher();
	const handleClickLoadMore = () => {
		dispatch('loadmore', {
			categoryName: categoryName,
			categoryId: categoryId,
			numOfProducts: numOfProducts
		});
	};
	const onAddToCart = async (event: CustomEvent) => {
		const product_name = event.detail.productName;
		const quantity = event.detail.quantity;
		const product_id = findProductIdByName(products, product_name);
		if (product_id) {
			if (quantity > 0) {
				const item = { product_id: product_id, quantity: quantity } as CartItem;
				// Send updated cartItems array to server
				const response = await fetch('/api/cart/update', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(item)
				});
				if (!response.ok) {
					throw new Error('Failed to update cart');
				}
				await getCartCount();
			}
		}
	};
	function findProductIdByName(products: Product[], productName: string): number | undefined {
		let productId: number | undefined;
		products.forEach((product) => {
			if (product.product_name === productName) {
				productId = product.id;
			}
		});
		return productId;
	}
</script>

<div class="flex flex-col items-center p-10">
	<div class="container py-10">
		<h1 class="text-6xl text-center lg:text-left">{categoryName}</h1>
		<hr />
	</div>
	<div class="container mx-auto flex justify-center items-center">
		<div class=" grid md:grid-cols-2 lg:grid-cols-3 gap-10">
			{#each products as product}
				<ProductCard
					productName={product.product_name}
					productPrice={product.selling_price}
					on:addtocart={onAddToCart}
				/>
			{/each}
		</div>
	</div>
	{#if showLoadMore}
		<button class="btn variant-filled my-10 uppercase" on:click={handleClickLoadMore}
			>Load More</button
		>
	{/if}
</div>
