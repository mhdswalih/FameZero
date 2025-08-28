import jwt, { JwtPayload } from "jsonwebtoken";

import dotenv from 'dotenv'


dotenv.config()
const ACCESS_SECRET = process.env.ACCESS_SECRET!

const REFRESH_SECRET = process.env.REFRESH_SECRET!

export const genrateAccessToken = (userId:string,role:string):string =>{
    return jwt.sign({userId,role},ACCESS_SECRET,{expiresIn:'15m'})
}

export const genrateRefreshToken = (userId:string):string =>{
    return jwt.sign({userId},REFRESH_SECRET,{expiresIn:'7d'})
}

export const veryfyAccessToken = (token:string):string | JwtPayload =>{
  return jwt.verify(token,ACCESS_SECRET)
}
export const getJWTInfoFromToken = (token: string): { id: string; role: string } => {
  try {
    console.log('token ',token);
    
    const decoded = jwt.decode(token) as JwtPayload;
    console.log('dec ',decoded);
    
    if (!decoded || !decoded.userId) {
      // throw new Error('Invalid token: missing userId ');
      console.log('\nosdfjlsd fsdlsdfjaskdjfklsa jdflksjlkfjslkdjfksjdfsjlk');
      
    }
    // if (!decoded || !decoded.userId || !decoded.role) {
    //   throw new Error('Invalid token: missing userId or role');
    // }
    return {
      id: decoded.userId,
      role: decoded.role
    };
  } catch (error:any) {
    throw new Error('Failed to decode token: ' + error.message);
  }
};
export function verifyRefreshToken(token: string | undefined) {
  if (!token) {
    throw new Error('No token provided');
  }
  return jwt.verify(token, REFRESH_SECRET) as {userId: string, role: string};
}