import { NextFunction, Request, Response } from "express";
import { AppError } from "../../common/utils/error.global.handler";
import { successResponse } from "../../common/utils/success.Responsive";
import { enumTransactionType } from "../../common/enum/transaction.enum";
import AccountRepository from "./account.repository";
import TransactionRepository from "../transaction/transaction.repository";
import { GenerateAccountNumber } from "../../common/enum/account.enum";





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
                accountId:account._id,
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

    create = async (req:Request,res:Response,next:NextFunction)=>{
        
        if (await this._accountModel.findOne({filter:{userId:req.user?._id}})) {
            throw new AppError("Account Already Exist",409)
        }
        const account = await this._accountModel.create({
            userId:req.user?._id,
            accountNumber:GenerateAccountNumber(),
            balance:0,
        })
        successResponse({res,message:"Account Created",data:account})
    }


}


export default new AccountService()