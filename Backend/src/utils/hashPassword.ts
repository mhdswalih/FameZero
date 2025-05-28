import bcrypt from 'bcrypt';

const salt = 10;

const hashPassword = async(password:string):Promise<string>=>{
   const hashPassword = await bcrypt.hash(password,salt)  
   return hashPassword 
}

export default hashPassword