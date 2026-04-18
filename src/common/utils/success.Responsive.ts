import { Response } from "express"



export const successResponse = ({res,data,message="Done",statusCode=200}:
    {
    res:Response,
    data?:any,
    message?:string,
    statusCode?:number
}) => {
    return res.status(statusCode).json({message,data})
}