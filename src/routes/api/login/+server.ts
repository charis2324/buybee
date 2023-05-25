import type { RequestHandler } from "./$types";
import { json } from "@sveltejs/kit";
import { checkIfUsernameExists, getPasswordByUsername, getUserIdByUsername } from "$lib/server/db";
import { JWT_SECRET } from "$lib/server/auth";

import jwt from 'jsonwebtoken';


const validLogin = (username: string, password: string) => {
    if (!checkIfUsernameExists(username)) {
        return 'Username does not exist'
    }
    const correctUserName = getPasswordByUsername(username);
    if (password !== correctUserName) {
        return 'Incorrect passward'
    }
    return null;
}


export const POST: RequestHandler = async (event) => {
    const data = await event.request.json()
    const username = data.username;
    const password = data.password;
    const errorMessage = validLogin(username, password)
    if (errorMessage !== null) {
        return json({ error: errorMessage }, { status: 400 })
    }
    const userId = getUserIdByUsername(username)
    const token = jwt.sign({ id: userId }, JWT_SECRET);
    event.cookies.set('token', token, { httpOnly: true, path: '/' })
    return json({ id: userId })
}