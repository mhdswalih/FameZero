import redisClient from "../config/redisService";


export async function blockUser(userId:string){
     await redisClient.set(`blacklist:${userId}`,'true') 
    console.log(`User ${userId} blacklisted user` );
    
}

export async function isUserBlackListed(userId: string): Promise<boolean> {
    const isMember = await redisClient.sIsMember("blacklisted_users", userId);
    return isMember === 1; 
}


export async function unBlackListUser(userId:string) {
    await redisClient.del(`blacklist:${userId}`);
    console.log(`User ${userId} remove from blacklist`);    
}




