import type { RequestHandler } from "./$types";
import { updateUserInfo } from "$lib/server/db";
import { decodeToken } from "$lib/server/auth";



export const POST: RequestHandler = async (event) => {
    try {
        const userToken = event.locals.userToken
        if (userToken) {
            const tokenPayload = decodeToken(userToken)
            if (tokenPayload) {
                const userId = tokenPayload.userId
                const userInfo: UserSafeInfo = await event.request.json();
                console.log(`Update User Info: ${userInfo.last_name}`);
                updateUserInfo(userId, userInfo)
                return new Response('Update User Info successfully', { status: 200 });
            }
        }
    }
    catch (error) {
        console.error(error);
        return new Response('Failed to update User Info', { status: 500 });
    }
    return new Response('Failed to update User Info', { status: 500 });
}