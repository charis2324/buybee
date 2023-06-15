<script lang="ts">
	import { getCartCount } from './cartCount';

	export let cartItems: CartItem[];

	async function updateQuantity(item: CartItem, event: Event) {
		const target = event.target as HTMLSelectElement;
		const newQuantity = parseInt(target.value);
		if (newQuantity > 0) {
			item.quantity = newQuantity;
			cartItems = cartItems;

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
		}
	}
	async function removeItem(event: Event, item: CartItem) {
		item.quantity = 0;
		console.log(item);
		cartItems = cartItems.filter((cartItem) => cartItem.product_id !== item.product_id);

		// Send updated cartItems array to server
		const response = await fetch('/api/cart/remove', {
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
</script>

<div class="max-w-full overflow-x-auto">
	<table class="min-w-full divide-y divide-gray-200">
		<thead>
			<tr>
				<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
					>Commodity name</th
				>
				<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
					>Quantity</th
				>
				<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
					>Unit price</th
				>
				<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
					>Subtotal</th
				>
				<th
					class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
				/>
			</tr>
		</thead>
		<tbody class="bg-white divide-y divide-gray-200">
			{#each cartItems as item}
				{#if item.quantity != 0}
					<tr>
						<td
							class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 overflow-hidden max-w-[20rem]"
							>{item.product_name}</td
						>
						<td class="px-6 py-4 whitespace-nowrap">
							<select
								class="rounded border-gray-300 text-sm text-gray-500"
								value={item.quantity.toString()}
								on:change={(event) => updateQuantity(item, event)}
							>
								<option value="1">1</option>
								<option value="2">2</option>
								<option value="3">3</option>
								<option value="4">4</option>
								<option value="5">5</option>
								<option value="6">6</option>
								<option value="7">7</option>
								<option value="8">8</option>
								<option value="9">9</option>
								<option value="10">10</option>
							</select>
						</td>
						<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
							>{item.selling_price.toFixed(2)}</td
						>
						<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
							>{(item.selling_price * item.quantity).toFixed(2)}</td
						>
						<td class="px-6 py-4 whitespace-nowrap">
							<button
								class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm"
								on:click={(event) => removeItem(event, item)}>Remove</button
							>
						</td>
					</tr>
				{/if}
			{/each}
		</tbody>
	</table>
</div>
