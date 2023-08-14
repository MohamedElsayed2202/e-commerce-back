import { sign } from "jsonwebtoken";
import Token from "../models/token";

export type Tokens = {
    token: string,
    refreshToken: string
}

export async function getTokens(id: string, role: string): Promise<Tokens> {
    const token = sign({
        id: id,
        role: role
    }, process.env.token_secret!, { expiresIn: '2h' });
    const refreshToken = sign({
        id: id,
        role: role
    }, process.env.refresh_secret!);
    const expiredAt = new Date();
    expiredAt.setDate(expiredAt.getDate() + 7);
    const toke = new Token({
        token: refreshToken,
        userId: id,
        expiredAt: expiredAt
    });
    await toke.save();
    return { token, refreshToken }
}

export async function regenerateRefreshToken(id: string, role: string): Promise<{ refreshToken: string; }> {
    const refreshToken = sign({
        id: id,
        role: role
    }, process.env.refreshToken!)
    await Token.findOneAndRemove({ userId: id });
    const expiredAt = new Date();
    expiredAt.setDate(expiredAt.getDate() + 7);
    const token = new Token({
        userId: id,
        token: refreshToken,
        expiredAt: expiredAt
    });
    await token.save();
    return { refreshToken };
}