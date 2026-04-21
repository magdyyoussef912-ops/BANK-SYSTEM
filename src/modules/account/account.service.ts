import { NextFunction, Request, Response } from "express";
import { AppError } from "../../common/utils/error.global.handler";
import { successResponse } from "../../common/utils/success.Responsive";
import { enumTransactionType } from "../../common/enum/transaction.enum";
import AccountRepository from "./account.repository";
import TransactionRepository from "../transaction/transaction.repository";





class AccountService {

    private readonly _accountModel = new AccountRepository()
    private readonly _transactionModel = new TransactionRepository()
    constructor(){}

    

    getAccount = async (req:Request,res:Response,next:NextFunction)=>{

        const account = await this._accountModel.find({filter:{userId:req.user?._id}})

        if (!account) {
            throw new AppError("Account Not Found",404)
        }

        successResponse({res,message:"Account Found",data:account})

    }

    status = async (req:Request,res:Response,next:NextFunction)=>{
        const {from,to} = req.query
        const account = await this._accountModel.findOne({filter:{userId:req.user?._id}})
        if (!account) {
            throw new AppError("Account Not Found",404)
        }
        
        

        const transaction = await this._transactionModel.find({
            filter:{
                accountNumber:account._id,
                createdAt:{
                    $gte:new Date(from as string),
                    $lte:new Date(to as string)
                }
            }
        })

        const totalDeposit  = transaction
        .filter(t => t.type === enumTransactionType.DEPOSIT)
        .reduce((sum, t) => sum + t.amount, 0);

    const totalWithdraw = transaction
        .filter(t => t.type === enumTransactionType.WITHDRAWAL)
        .reduce((sum, t) => sum + t.amount, 0);

    const totalTransfer = transaction
        .filter(t => t.type === enumTransactionType.TRANSFER)
        .reduce((sum, t) => sum + t.amount, 0);


        successResponse({res,message:"Account Status",data:{transaction,totalDeposit,totalWithdraw,totalTransfer} })
    }


}


export default new AccountService()