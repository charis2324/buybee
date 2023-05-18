import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { addUser, checkIfEmailExists, checkIfUserExists, checkIfUsernameExists } from "$lib/server/db";


const validateUserInfo = (userInfo: User) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const usernameRegex = /^[a-zA-Z0-9_]{3,}$/;

    if (!emailRegex.test(userInfo.email)) {
        return 'Invalid email';
    }
    if (!usernameRegex.test(userInfo.username)) {
        return 'Invalid username';
    }
    if (userInfo.password.length < 6) {
        return 'Password must be at least 6 characters long';
    }
    if (checkIfUserExists(userInfo.username, userInfo.email)) {
        if (checkIfUsernameExists(userInfo.username)) {
            return 'Username already exists'
        }
        if (checkIfEmailExists(userInfo.email)) {
            return 'Email already exists'
        }
    }
    return null;
};

export const POST: RequestHandler = async (event) => {
    const data = await event.request.json()
    const userInfo = data.user as User
    const validationError = validateUserInfo(userInfo)
    console.log(validationError)
    if (validationError) {
        return json({ error: validationError }, { status: 400 })
    }
    addUser(userInfo);
    return json({ success: 'true' })
}