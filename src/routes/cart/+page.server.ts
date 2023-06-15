import { getUserShoppingCartStatus, updateShoppingCart } from '$lib/server/db/index.js'
import { decodeToken } from '$lib/server/auth/index.js'


export const load = ({ locals }) => {
    const userToken = locals.userToken;
    console.log(userToken);
    if (userToken && userToken != '') { // check if userToken is defined
        const tokenPayload = decodeToken(userToken);
        console.log(tokenPayload)
        if (tokenPayload) { // check if decodeToken returns a valid payload
            const userId = tokenPayload.userId
            const cart = getUserShoppingCartStatus(userId);
            return {
                shoppingCart: cart
            }
        }
    }
};