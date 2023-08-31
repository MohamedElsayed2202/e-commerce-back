import { sign, verify } from "jsonwebtoken";
import CustomeError from "../interfaces/custome-error";
import { IFullUser, IUser } from "../interfaces/interfaces";
import Profile from "../models/profile";
import User from "../models/user";
import bcrypt from 'bcryptjs';
import Token from "../models/token";
import { Request } from "express";
import { Types } from "mongoose";
import { validationResult } from "express-validator";
import { createTransport } from 'nodemailer'
import HTML_TEMPLATE from "../mail-template";


export function errorHandler(code: number, message: string, errors?: any): void {
  const error = new CustomeError(code, message, errors);
  throw error
}

export function errorThrower(error: any, next: any): void {
  if (!error.code) {
    error.code = 500;
  }
  next(error);
}

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
  }, process.env.refreshToken!);
  
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

export function getRoleAndId(req: Request): { id: string, role: string } {
  const token = req.get('Authorization')!.split(' ')[1];
  const data: any = verify(token, process.env.token_secret!);
  return { id: data.id, role: data.role };
}

export async function registration(data: IFullUser, role?: string): Promise<IUser & { _id: Types.ObjectId; }> {
  let { name, email, password, phone, address } = data;
  const profile = new Profile({
    address: address,
    phone: phone,
  })
  await profile.save();
  password = await bcrypt.hash(password, 12);
  const user = new User({
    name,
    email,
    password,
    role,
    profile: profile._id
  });
  await user.save();
  return user
}

export function isValidated(req: Request): void {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    errorHandler(422, 'Validation faild.', errors.array());
  }
}

export async function sendEmail(email: string, link: string, next: any): Promise<void> {
  try {
    const transporter = createTransport({
      service: 'gmail',
      host: process.env.HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.USER,
        pass: process.env.PASS
      }
    });
    await transporter.sendMail({
      from: `Shoes House <none@replay.com>`,
      to: email,
      subject: "Email confirmation",
      html: HTML_TEMPLATE(link)
    })
  } catch (error) {
    errorThrower(error, next);
  }
}


