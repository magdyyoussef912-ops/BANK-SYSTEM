import { NextFunction, Request, Response } from "express"



export class AppError extends Error { 

    constructor(public message:string,public statusCode:number = 500){
        super(message)
        this.message = message
        this.statusCode = statusCode
    }

}


export const globalErrorHandler = (err:AppError,req:Request,res:Response,next:NextFunction) => {
    const statusCode = err.statusCode || 500
    return res.status(statusCode).json({message:err.message,statusCode:err.statusCode,stack:err.stack})
}
     