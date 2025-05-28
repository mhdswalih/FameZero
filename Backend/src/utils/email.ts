import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

const transport = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    }
})

export const sendEmail = async(to:string,subject:string,text:string,html?:string):Promise<void> =>{
    await transport.sendMail({
        from:process.env.EMAIL_USER,
        to,
        subject,
        text,
        html,
    })
}