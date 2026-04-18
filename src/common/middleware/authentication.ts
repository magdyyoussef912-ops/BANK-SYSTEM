import { NextFunction, Request, Response } from "express"
import { AppError } from "../utils/error.global.handler"
import { ACCESS_TOKEN_KEY, PREFIX } from "../../config/config.service"
import { VerfiyToken } from "../utils/token.service"
import UserRepository from "../../repositories/user.repository"






export const Authentication = async (req:Request,res:Response,next:NextFunction)=>{
    const {authorization} = req.headers
    if (!authorization) {
        throw new AppError("Token Not Found")
    }
    const [prefix,token] : string[] = authorization.split(" ")
    if (prefix !== PREFIX) {
        throw new AppError("inValid Prefix")
    }
    const decoded  = VerfiyToken ({token:token!,secretOrPublicKey:ACCESS_TOKEN_KEY})
    if (!decoded || typeof decoded !== "object" || !("id" in decoded)) {
        throw new AppError("inValid token payload")
    }
    

    const user =  await new UserRepository().findOne({filter:{_id:decoded.id}})
    if (!user) {
        throw new AppError("User Not Found",409)
    }

    

    req.user = user
    req.decoded = decoded
    next()
}
