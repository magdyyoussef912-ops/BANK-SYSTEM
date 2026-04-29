import { NextFunction, Request, Response } from "express";
import { AppError } from "../../common/utils/error.global.handler";
import { successResponse } from "../../common/utils/success.Responsive";
import { enumTransactionStatus, enumTransactionType } from "../../common/enum/transaction.enum";
import { enumStatusAccount } from "../../common/enum/account.enum";
import BeneficiaryRepository from "../beneficiary/beneficiary.repository";
import AccountRepository from "../account/account.repository";
import TransactionRepository from "./transaction.repository";
import UserRepository from "../auth/user.repository";
import { startSession, Types } from "mongoose";
import cardRepository from "../card/card.repository";





class TransactionService {

    private readonly _transactionModel = new TransactionRepository()
    private readonly _accountModel = new AccountRepository()
    private readonly _userModel = new UserRepository()
    private readonly _cardModel = new cardRepository()
    private readonly _beneficiaryModel = new BeneficiaryRepository() 

    private  getAccountByCardOrDefault =  async (userId : Types.ObjectId , cardId?: Types.ObjectId )=>{
        if (cardId) {
            const card = await this._cardModel.findOne({
                filter : { userId , _id: cardId }
            })
            if (!card) {
                throw new AppError("Card Not Found", 404)
            }
            const account = await this._accountModel.findOne({
                filter : { userId , _id: card.accountId }
            })
            if (!account) {
                throw new AppError("Account Not Found", 404)
            }
            return account
        }

        const account = await this._accountModel.findOne({
            filter : { userId ,default:true, status: enumStatusAccount.ACTIVE },
        })
        if (!account) {
            throw new AppError("Account Not Found, or Account is Blocked", 404)
        }
        return account
    }
    constructor() { }


    deposit = async (req: Request, res: Response, next: NextFunction) => {
        const { amount ,cardId } = req.body
        

        const account = await this.getAccountByCardOrDefault(req.user?._id ,cardId)
        

        
        const deposit = await this._transactionModel.create({
            userId: req.user?._id,
            accountId: account._id,
            amount,
            balanceBefore: account.balance,
            balanceAfter: account.balance + amount,
            type: enumTransactionType.DEPOSIT,
            status: enumTransactionStatus.SUCCESS
        }) 

        account.balance += amount
        account.updatedAt = new Date()
        await account.save()

        successResponse({ res, message: "Deposit Successfully", data: account })

    }


    withdraw = async (req: Request, res: Response, next: NextFunction) => {
        const { amount , cardId } = req.body

        const account = await this.getAccountByCardOrDefault(req.user?._id ,cardId)

        if (account.balance < amount) {
            throw new AppError("Insufficient Balance", 400)
        }
        const withdraw = await this._transactionModel.create({
            userId: req.user?._id,
            accountId: account._id,
            amount,
            balanceBefore: account.balance,
            balanceAfter: account.balance - amount,
            type: enumTransactionType.WITHDRAWAL,
            status: enumTransactionStatus.SUCCESS
        })

        account.balance -= amount
        account.updatedAt = new Date()
        await account.save()

        successResponse({ res, message: "Withdraw Successfully", data: account })

    }

    transfer = async (req: Request, res: Response, next: NextFunction) => {
        const { beneficiaryId, amount ,cardId} = req.body

        const senderAccount = await this.getAccountByCardOrDefault(req.user?._id ,cardId)

        const beneficiary = await this._beneficiaryModel.findOne({
            filter: { _id: beneficiaryId , ownerUserId: req.user?._id }
        })

        if (!beneficiary) {
            throw new AppError("Beneficiary Not Found", 404)
        }


        const receiverAccount = await this._accountModel.findOne({
            filter: { accountNumber: beneficiary.accountNumber }
        })

        if (!receiverAccount) {
            throw new AppError("Receiver Account Not Found", 404)
        }

        if (senderAccount.balance < amount) {
            throw new AppError("Insufficient Balance", 400)
        }

        const session = await startSession()
        try {
            session.startTransaction() 
            await Promise.all([
                this._accountModel.findOneAndUpdate({
                    filter: { userId: req.user?._id },
                    update: { $inc: { balance: -amount } },
                    options: { session }
                }),
                this._accountModel.findOneAndUpdate({
                    filter: { _id: receiverAccount._id },
                    update: { $inc: { balance: amount } },
                    options: { session }
                })
            ])
            const transfer = await this._transactionModel.create({
                userId: req.user?._id,
                accountId: senderAccount._id,
                amount,
                balanceBefore: senderAccount.balance,
                balanceAfter: senderAccount.balance - amount,
                type: enumTransactionType.TRANSFER,
                status: enumTransactionStatus.SUCCESS
            })

            await session.commitTransaction()

            successResponse({ res, message: "Transfer Successfully", data: transfer })

        } catch (error) {
            await session.abortTransaction()
            throw new AppError(error as string, 500)
        } finally {
            session.endSession()
        }



    }

    getAllTransactions = async (req: Request, res: Response, next: NextFunction) => {
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 10
        const skip = (page - 1) * limit
        const transactions = await this._transactionModel.find({
            filter: { userId: req.user?._id },
            options: { skip, limit }
        })
        successResponse({ res, message: "Transactions Fetched Successfully", data: transactions })
    }

    getSingleTransaction = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params
        const transaction = await this._transactionModel.findOne({
            filter: { _id: id!, userId: req.user?._id }
        })
        if (!transaction) {
            throw new AppError("Transaction Not Found", 404)
        }
        successResponse({ res, message: "Transaction Fetched Successfully", data: transaction })
    }

    summary = async (req: Request, res: Response, next: NextFunction) => {
        const summary = await this._transactionModel.aggregate([
            {
                $match: {
                    userId: req.user?._id
                }
            },
            {
                $group: {
                    _id: "$type",
                    count: { $sum: 1 },
                    totalAmount: { $sum: "$amount" }
                }
            }
        ])
        successResponse({ res, message: "Summary Fetched Successfully", data: summary })
    }
}


export default new TransactionService()