import type { RequestHandler } from "../$types";
import { getCartItemCount } from "$lib/server/db";
import { decodeToken } from "$lib/server/auth";

export const POST: RequestHandler = async (request) => {
    try {
        const authToken = request.locals.userToken;
        if (!authToken) {
            return new Response('User not authenticated', { status: 401 });
        }

        const tokenPayload = decodeToken(authToken);
        if (!tokenPayload) {
            return new Response('Invalid authentication token', { status: 401 });
        }

        const loggedInUserId = tokenPayload.userId;
        console.log(`Get cart count: ${loggedInUserId}`);
        const cartItemCount = getCartItemCount(loggedInUserId);
        return new Response(JSON.stringify({ cartItemCount }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
        console.error(error);
        return new Response('Failed to get cart count', { status: 500 });
    }
};