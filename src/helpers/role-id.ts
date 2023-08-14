import { Request } from "express";
import { verify } from "jsonwebtoken";

export function getRoleAndId (req: Request): {id: string, role: string} {
    const token = req.get('Authorization')!.split(' ')[1];
    const data: any = verify(token, process.env.token_secret!);
    return {id: data.id, role: data.role};
}