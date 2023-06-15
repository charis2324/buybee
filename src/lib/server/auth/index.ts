import jwt from 'jsonwebtoken'

export const JWT_SECRET = 'JWT_SECRET';

export function decodeToken(token: string) {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
        return decoded;
    } catch (err) {
        // handle the error here (e.g., log it or throw a custom error)
        console.error('Error decoding token:', (err as Error).message);
        return null;
    }
}
export function isValidToken(token: string): boolean {
    const decoded = decodeToken(token);
    return !!decoded && 'userId' in decoded;
}