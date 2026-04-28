import { NextFunction, Request, Response } from "express"
import { AppError } from "../utils/error.global.handler"
import { ACCESS_TOKEN_KEY, PREFIX } from "../../config/config.service"
import { VerfiyToken } from "../utils/security/token.service"
import UserRepository from "../../modules/auth/user.repository"
import redisService from "../service/redis.service"


const userRepository = new UserRepository()




export const Authentication = async (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers
    if (!authorization) {
        throw new AppError("Token Not Found")
    }
    const [prefix, token]: string[] = authorization.split(" ")
    if (prefix !== PREFIX) {
        throw new AppError("inValid Prefix")
    }
    const decoded = VerfiyToken({ token: token!, secretOrPublicKey: ACCESS_TOKEN_KEY })
    if (!decoded || typeof decoded !== "object" || !("id" in decoded)) {
        throw new AppError("inValid token payload")
    }
    

    const user = await userRepository.findOne({ filter: { _id: decoded.id } })
    if (!user) {
        throw new AppError("User Not Found", 409)
    }


    if (user.changeCredential?.getTime() > decoded.iat!*1000) {
        throw new AppError("inValid Token")
    }

    const  revoked_token_value = await redisService.get(redisService.revoked_token({userId:decoded.id!,jti:decoded.jti! })) 
    if (revoked_token_value) {
        throw new AppError("inValid Token revoked")
    }



    req.user = user
    req.decoded = decoded
    next()
}
