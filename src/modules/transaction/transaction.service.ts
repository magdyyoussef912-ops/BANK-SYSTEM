import { NextFunction, Request, Response } from "express";
import { AppError } from "../../common/utils/error.global.handler";
import { successResponse } from "../../common/utils/success.Responsive";
import TransactionRepository from "../../repositories/transaction.repository";
import AccountRepository from "../../repositories/account.repository";
import { enumTransactionStatus, enumTransactionType } from "../../common/enum/transaction.enum";
import { enumStatusAccount } from "../../common/enum/account.enum";





class TransactionService {

    private readonly _transactionModel = new TransactionRepository()
    private readonly _accountModel = new AccountRepository()
    constructor(){}


    deposit = async (req:Request,res:Response,next:NextFunction)=>{
        const {amount} = req.body
        
        
        const account = await this._accountModel.findOneAndUpdate({
            filter:{userId:req.user?._id,status:enumStatusAccount.ACTIVE},
            update:{$inc:{balance:amount}},
            options:{new:false}
        })
        if(!account){
            throw new AppError("Account Not Found, or Account is Blocked",404)
        }
        const deposit = await this._transactionModel.create({
            userId:req.user?._id,
            accountId:account._id,
            amount,
            balanceBefore:account.balance,
            balanceAfter:account.balance + amount,
            type:enumTransactionType.DEPOSIT,
            status:enumTransactionStatus.SUCCESS
        }) 

        successResponse({res,message:"Deposit Successfully",data:account})
  
    }


    withdraw = async (req:Request,res:Response,next:NextFunction)=>{
        const {amount} = req.body
        const account = await this._accountModel.findOneAndUpdate({
            filter:{userId:req.user?._id,status:enumStatusAccount.ACTIVE,balance:{$gte:amount}},
            update:{$inc:{balance:-amount}},
            options:{new:false}
        })
        if(!account){
            throw new AppError("Account Not Found,balance is less than amount, or Account is Blocked",404)
        }
        const withdraw = await this._transactionModel.create({
            userId:req.user?._id,
            accountId:account._id,
            amount,
            balanceBefore:account.balance,
            balanceAfter:account.balance - amount,
            type:enumTransactionType.WITHDRAWAL,
            status:enumTransactionStatus.SUCCESS
        }) 

        successResponse({res,message:"Withdraw Successfully",data:account})
  
    }



    getAllTransactions = async (req:Request,res:Response,next:NextFunction)=>{
        const transactions = await this._transactionModel.find({
            filter:{userId:req.user?._id,status:enumStatusAccount.ACTIVE}
        }) 
        successResponse({res,message:"Transactions Fetched Successfully",data:transactions})

    }

    getSingleTransaction = async (req:Request,res:Response,next:NextFunction)=>{
        const {id} = req.params
        const transaction = await this._transactionModel.findOne({
            filter:{_id:id!,status:enumStatusAccount.ACTIVE}
        }) 
        if(!transaction){
            throw new AppError("Transaction Not Found",404)
        }
        successResponse({res,message:"Transaction Fetched Successfully",data:transaction})
    }

    

    
    
}


export default new TransactionService()