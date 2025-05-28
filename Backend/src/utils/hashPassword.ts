import bcrypt from 'bcrypt';


export const hashPassword = async(password:string):Promise<string>=>{
   const hashPassword = await bcrypt.hash(password,10)  
   return hashPassword 
}

export const comparePassword =  async(password:string,hashPassword:string):Promise<boolean>=>{
   return await bcrypt.compare(password,hashPassword)
}
