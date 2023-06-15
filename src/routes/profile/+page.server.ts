import { decodeToken } from '$lib/server/auth/index.js';
import { getUserInfo } from '$lib/server/db/index.js';
export const load = ({ locals }) => {
    const userToken = locals.userToken;
    let itemInCart = 0;
    if (userToken) {
        const tokenPayload = decodeToken(userToken)
        if (tokenPayload) {
            return { userToken: locals.userToken, userInfo: getUserInfo(tokenPayload.userId) }
        }
    }
    return { userToken: locals.userToken, userInfo: undefined }
}