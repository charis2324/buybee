import type { RequestHandler } from "../$types";
import { updateShoppingCart } from "$lib/server/db";
import { decodeToken } from "$lib/server/auth";



export const POST: RequestHandler = async (event) => {
    try {
        const userToken = event.locals.userToken
        if (userToken) {
            const tokenPayload = decodeToken(userToken)
            if (tokenPayload) {
                const userId = tokenPayload.userId
                const cartItem: CartItem = await event.request.json();
                console.log(`Update cart item: ${{ cartItem }}`);
                updateShoppingCart(userId, cartItem.product_id, cartItem.quantity)
                return new Response('Cart updated successfully', { status: 200 });
            }
        }
    }
    catch (error) {
        console.error(error);
        return new Response('Failed to update cart', { status: 500 });
    }
    return new Response('Failed to update cart', { status: 500 });
}