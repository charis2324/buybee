import { json, redirect } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"

export const GET: RequestHandler = (event) => {
    event.cookies.delete('token', { path: '/' })
    console.log(event.cookies.get('token'))
    throw redirect(302, '/')
}

