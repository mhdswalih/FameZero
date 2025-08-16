import crypto from 'crypto'
import redisClient from '../config/redisService'
import { sendEmail } from './email'
const RESET_TOKEN_PREFIX = 'resetToken:'; 
export const genrateAndStoreResetToken = async(email:string):Promise<string> => {
    const token = crypto.randomBytes(32).toString('hex')  
      const redisKey = `${RESET_TOKEN_PREFIX}${token}`;
    await redisClient.setEx(redisKey ,15 * 60,email)
    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`
       const htmlContent = `
        <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 20px; border-radius: 8px;">
            <div style="background-color: #fff; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); text-align: center;">
                <h2 style="color: #007bff;">Reset Your Password</h2>
                <p style="font-size: 16px;">We received a request to reset your FlameZero account password.</p>
                <a href="${resetUrl}" style="display: inline-block; margin: 20px 0; padding: 12px 24px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">
                    Reset Password
                </a>
                <p style="font-size: 14px; color: #666;">This link will expire in <strong>15 minutes</strong>.</p>
                <p style="font-size: 14px; color: #999;">If you didn’t request this, please ignore this email.</p>
            </div>
        </div>
    `;
    await sendEmail(email, 'FlameZero - Password Reset Link', '', htmlContent);
    return token;
}

export const veryResetToken = async(token:string):Promise<string | null> =>{  
    const redisKey = `${RESET_TOKEN_PREFIX}${token}`;
    const email = await redisClient.get(redisKey)   
    return email
}
export const deleteResetToken = async(token:string):Promise<void> =>{
    const redisKey = `${RESET_TOKEN_PREFIX}${token}`;
    await redisClient.del(redisKey)
}