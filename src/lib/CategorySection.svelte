<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import ProductCard from './ProductCard.svelte';

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
</script>

<div class="flex flex-col items-center p-10">
	<div class="container py-10">
		<h1 class="text-6xl text-center lg:text-left">{categoryName}</h1>
		<hr />
	</div>
	<div class="container mx-auto flex justify-center items-center">
		<div class=" grid md:grid-cols-2 lg:grid-cols-3 gap-10">
			{#each products as product}
				<ProductCard productName={product.product_name} productPrice={product.selling_price} />
			{/each}
		</div>
	</div>
	{#if showLoadMore}
		<button class="btn variant-filled my-10 uppercase" on:click={handleClickLoadMore}
			>Load More</button
		>
	{/if}
</div>
