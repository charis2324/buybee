import { writable } from 'svelte/store';


export let cartCount = writable<number>(0);

export async function getCartCount() {
    try {
        const response = await fetch('/api/cart/cartCount', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
            }),
        });

        if (!response.ok) {
            throw new Error(`Failed to get cart count: ${response.status}`);
        }
        const data = await response.json();
        cartCount.set(data.cartItemCount)
    } catch (error) {
        console.error(error);
    }
}