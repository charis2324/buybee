<script lang="ts">
	import ShoppingCartTable from '$lib/ShoppingCartTable.svelte';

	export let data;

	const shoppingCart = data.shoppingCart;
	let cartItems = shoppingCart?.cartItems;
	let totalAmount: number = 0;
	$: totalAmount = calculateTotal(cartItems);
	function calculateTotal(cartItems: CartItem[] | undefined): number {
		if (!cartItems) {
			return 0;
		}
		let total = 0;
		for (const item of cartItems) {
			total += item.selling_price * item.quantity;
		}
		return total;
	}
</script>

<div class="card max-w-[90%] min-h-[400px] p-10 variant-filled mx-auto my-10">
	{#if !shoppingCart || !cartItems || cartItems?.length < 1}
		<div class="w-[90%] mx-auto mb-5 text-center bg-amber-200">No Item in Cart</div>
	{:else if cartItems}
		<ShoppingCartTable bind:cartItems />
	{/if}
	<hr class="w-full mx-auto mt-4" />
	<div class="text-right pt-4">
		<p>Total <span class="text-red-600 h3">{totalAmount} USD</span></p>
		<a class="underline underline-offset-4" href="/">Back to Shopping</a>
	</div>
</div>
