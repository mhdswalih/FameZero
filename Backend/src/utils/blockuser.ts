import redisClient from "../config/redisService";


export async function blockUser(userId:string){
     await redisClient.set(`blacklist:${userId}`,'true') 
    console.log(`User ${userId} blacklisted user` );
    
}

export async function isUserBlackListed(userId:string){
    const isUserBlackListed = await redisClient.get(`blacklist${userId}`)
    return isUserBlackListed === 'true'
}

export async function unBlackListUser(userId:string) {
    await redisClient.del(`blacklist:${userId}`);
    console.log(`User ${userId} remove from blacklist`);    
}




