import type { Handle } from "@sveltejs/kit"

export const handle: Handle = async ({ event, resolve }) => {

    event.locals.userToken = event.cookies.get('token');
    return resolve(event)
}