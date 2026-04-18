import { NextFunction, Request, Response } from "express";
import AccountRepository from "../../repositories/account.repository";
import { AppError } from "../../common/utils/error.global.handler";
import { successResponse } from "../../common/utils/success.Responsive";





class AccountService {

    private readonly _accountModel = new AccountRepository()
    constructor(){}

    

    getAccount = async (req:Request,res:Response,next:NextFunction)=>{

        const account = await this._accountModel.find({filter:{userId:req.user?._id}})

        if (!account) {
            throw new AppError("Account Not Found",404)
        }

        successResponse({res,message:"Account Found",data:account})

    }

    
    
}


export default new AccountService()