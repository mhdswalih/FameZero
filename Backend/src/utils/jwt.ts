import jwt, { JwtPayload } from "jsonwebtoken";

import dotenv from 'dotenv'

dotenv.config()
const ACCESS_SECRET = process.env.ACCESS_SECRET!

const REFRESH_SECRET = process.env.REFRESH_SECRET!



export const genrateAccessToken = (userId:string):string =>{
    return jwt.sign({userId},ACCESS_SECRET,{expiresIn:'15m'})
}

export const genrateRefreshToken = (userId:string):string =>{
    return jwt.sign({userId},REFRESH_SECRET,{expiresIn:'7d'})
}

export const veryfyAccessToken = (token:string):string | JwtPayload =>{
  return jwt.verify(token,ACCESS_SECRET)
}

export const verifyRefreshToken = (token:string):string | JwtPayload =>{
    return jwt.verify(token,REFRESH_SECRET)
}