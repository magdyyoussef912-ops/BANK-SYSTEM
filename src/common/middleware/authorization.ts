import { NextFunction, Request, Response } from "express"
import { AppError } from "../utils/error.global.handler"





export const Authorization = (...roles:string[]) => {
    return (req:Request,res:Response,next:NextFunction) => {
        if (!roles.includes(req.user.role)) {
            throw new AppError("Unauthorized",403)
        }
        next()
    }
}