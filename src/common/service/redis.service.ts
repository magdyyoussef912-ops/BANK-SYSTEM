import { createClient, RedisClientType } from "redis";
import { REDIS_URL } from "../../config/config.service";
import { Types } from "mongoose";


class redisService{

    private readonly Client : RedisClientType;

    constructor(){
        this.Client = createClient({
            url:REDIS_URL,
        })
        this.handlerDisconnect()
    }

    
    async handlerDisconnect(){
        this.Client.on("error",(error)=>{
            console.log("Redis error: ",error);
        })
    }

    async connect (){
        await this.Client.connect()
        console.log("Redis connection Seccssefully........");
    }





    revoked_token = ({userId,jti}:{userId:string|Types.ObjectId,jti:string})=>{
        return `revoke_token::${userId}::${jti}`
    }
    
    revoked_id_token = ({userId}:{userId:string|Types.ObjectId})=>{
        return `revoke_token::${userId}`
    } 
    
    
    setValue = async ({key,value,ttl}:{key:string,value:string|number|object,ttl?:number})=>{
        try {
            const data = typeof(value) == "string" ? value : JSON.stringify(value)
            return  ttl ? await this.Client.set(key,data,{EX:ttl}) :  await this.Client.set(key,data)
        } catch (error) {
            console.log(error,"fail to set operation");        
        }
    }
    
    update = async ({key,value}:{key:string,value:string})=>{
        try {
            if(!await this.Client.exists(key)) return 0
            return await this.setValue({key,value})
        } catch (error) {
            console.log(error,"fail to set operation");        
        }
    }
    
    get = async (key:string)=>{
        try {
            try {
                return JSON.parse(await this.Client.get(key) as string)
            } catch (error) {
                return await this.Client.get(key)
            }
        } catch (error) {
            console.log(error,"fail to set operation");        
        }
    }
    
    ttl = async (key:string)=>{
        try {
            return await this.Client.ttl(key)
        } catch (error) {
            console.log(error,"fail to ttl operation");        
        }
    }
    
    exists = async (key:string)=>{
        try {
            return await this.Client.exists(key)
        } catch (error) {
            console.log(error,"fail to exists operation");        
        }
    }
    
    expire = async ({key,ttl}:{key:string,ttl:number})=>{
        try {
            return await this.Client.expire(key,ttl)
        } catch (error) {
            console.log(error,"fail to expire operation");        
        }
    }
    
    del = async (key:string|string[])=>{
        try {
            if (!key.length) return 0
            return await this.Client.del(key)
        } catch (error) {
            console.log(error,"fail to del operation");        
        }
    }
    
    keys = async (pattern:string)=>{
        try {
            return await this.Client.keys(`${pattern}*`)
        } catch (error) {
            console.log(error,"fail to keys operation");        
        }
    }
    
    Incr = async (pattern:string)=>{
        try {
            return await this.Client.incr(pattern)
        } catch (error) {
            console.log(error,"fail to Incr operation");        
        }
    }
    


    
}


export default new redisService()
