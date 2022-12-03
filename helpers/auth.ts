import { hash, compare } from 'bcryptjs';

export async function hashPassword(password: string) {
    const hashedPassword = await hash(password, 10);

    return hashedPassword;
}

export async function verifyPassword(password: string, hashedPassword: string) {
    const isVaild = await compare(password, hashedPassword);

    return isVaild;
}