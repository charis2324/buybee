import type { RequestHandler } from "../$types";
import { removeItemFromCart } from "$lib/server/db";
import { decodeToken } from "$lib/server/auth";



export const POST: RequestHandler = async (event) => {
    try {
        const userToken = event.locals.userToken
        if (userToken) {
            const tokenPayload = decodeToken(userToken)
            if (tokenPayload) {
                const userId = tokenPayload.userId
                const cartItem: CartItem = await event.request.json();
                console.log(`Remove cart item: ${{ cartItem }}`);
                removeItemFromCart(userId, cartItem.product_id)
                return new Response('Cart item removed successfully', { status: 200 });
            }
        }
    }
    catch (error) {
        console.error(error);
        return new Response('Failed to remove cart', { status: 500 });
    }
    return new Response('Failed to remove cart', { status: 500 });
}