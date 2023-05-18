<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let productName: string;
	export let productPrice: number;
	let quantity: number = 1;

	const handleClickReduceQuantity = () => {
		if (quantity > 1) {
			quantity -= 1;
		}
	};
	const handleClickAddQuantity = () => {
		quantity += 1;
	};
	const dispatch = createEventDispatcher();
	const handleClickAddToCart = () => {
		dispatch('addtocart', { quantity: quantity, productName: productName });
	};
</script>

<div class="card card-hover bg-white p-4 w-80">
	<div
		class="card-header h-48 flex flex-col justify-between p-4 bg-cover bg-center"
		style="background-image: url('https://images.pexels.com/photos/7989741/pexels-photo-7989741.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940')"
	/>
	<div class="card-body p-4 flex flex-col items-center">
		<h2 class="h2 text-left mt-1 w-full h-40 line-clamp-5">{productName}</h2>
		<p class="text-center text-gray-300 mt-1">${productPrice}</p>
		<div class="inline-flex items-center mt-2">
			<button
				class="bg-white rounded-l border text-gray-600 hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50 inline-flex items-center px-2 py-1 border-r border-gray-200"
				on:click={handleClickReduceQuantity}
				><svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-4"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M20 12H4"
					/></svg
				>
			</button>
			<div
				class="bg-gray-100 border-t border-b border-gray-100 text-gray-600 hover:bg-gray-100 inline-flex items-center px-4 py-1 select-none"
			>
				{quantity}
			</div>
			<button
				class="bg-white rounded-r border text-gray-600 hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50 inline-flex items-center px-2 py-1 border-r border-gray-200"
				on:click={handleClickAddQuantity}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-4"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 4v16m8-8H4"
					/>
				</svg>
			</button>
		</div>
		<button
			class="btn variant-filled-primary py-2 px-4 mt-4 w-full flex items-center justify-center"
			on:click={handleClickAddToCart}>Add to order</button
		>
	</div>
</div>
