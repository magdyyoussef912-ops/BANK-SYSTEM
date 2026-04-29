import { Request ,Response,NextFunction} from "express"
import UserRepository from "../auth/user.repository"
import { successResponse } from "../../common/utils/success.Responsive"
import { Types } from "mongoose"
import { AppError } from "../../common/utils/error.global.handler"
import { RoleEnum, StatusEnumUser } from "../../common/enum/user.enum"
import AccountRepository from "../account/account.repository"
import { enumStatusAccount } from "../../common/enum/account.enum"
import cardRepository from "../card/card.repository"
import TransactionRepository from "../transaction/transaction.repository"
import { cardStatus } from "../../common/enum/creditcard.enum"







class adminService {

    private readonly _userModel =new UserRepository()
    private readonly _accountModel =new AccountRepository()
    private readonly _cardModel =new cardRepository()
    private readonly _transactionModel =new TransactionRepository()



    constructor(){}


    // user
    getAllUsers = async(req:Request,res:Response,next:NextFunction)=>{
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 10
        const skip = (page - 1) * limit

        const users = await this._userModel.find({
            filter:{role:RoleEnum.USER},
            options:{limit,skip}
        })

        successResponse({res,message:"All Users",data:users})
    }

    getUser = async(req:Request,res:Response,next:NextFunction)=>{
        const {userId} = req.params
        const user = await this._userModel.findById(new Types.ObjectId(userId as string) )
        if (!user) {
            throw new AppError("user Not Found",409)
        }
        successResponse({res,message:"Successfully",data:user})
    }

    blockUser = async(req:Request,res:Response,next:NextFunction)=>{
       const {userId} = req.params
        const user = await this._userModel.findOneAndUpdate({
            filter:{_id:userId!},
            update: {status:StatusEnumUser.Block}
        } )
        if (!user) {
            throw new AppError("user Not Found",409)
        }
        successResponse({res,message:"user Blocked Successfully"})

    }

    UnblockUser = async(req:Request,res:Response,next:NextFunction)=>{
       const {userId} = req.params
        const user = await this._userModel.findOneAndUpdate({
            filter:{_id:userId!,status:StatusEnumUser.Block},
            update: {status:StatusEnumUser.Active}
        } )
        if (!user) {
            throw new AppError("user Not Found",409)
        }
        successResponse({res,message:"user Actived Successfully"})

    }

    deleteUser = async(req:Request,res:Response,next:NextFunction)=>{
       const {userId} = req.params
        const user = await this._userModel.findOneAndDelete({
            filter:{_id:userId!}
        } )
        if (!user) {
            throw new AppError("user Not Found",409)
        }
        successResponse({res,message:"user Deleted Successfully"})
    }

    // account
    getAllAccounts = async(req:Request,res:Response,next:NextFunction)=>{
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 10
        const skip = (page - 1) * limit

        const Accounts = await this._accountModel.find({
            filter:{},
            options:{limit,skip}
        })

        successResponse({res,message:"All Accounts",data:Accounts})
    }

    blockAccount = async(req:Request,res:Response,next:NextFunction)=>{
       const {accountId} = req.params
        const account = await this._accountModel.findOneAndUpdate({
            filter:{_id:accountId!},
            update: {status:enumStatusAccount.BLOCKED}
        } )
        if (!account) {
            throw new AppError("account Not Found",409)
        }
        successResponse({res,message:"account Blocked Successfully"})

    }

    unBlockAccount = async(req:Request,res:Response,next:NextFunction)=>{
       const {accountId} = req.params
        const account = await this._accountModel.findOneAndUpdate({
            filter:{_id:accountId!,status:enumStatusAccount.BLOCKED},
            update: {status:enumStatusAccount.ACTIVE}
        } )
        if (!account) {
            throw new AppError("account Not Found",409)
        }
        successResponse({res,message:"account ACTIVEd Successfully"})

    }

    // card
    getAllCards = async(req:Request,res:Response,next:NextFunction)=>{
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 10
        const skip = (page - 1) * limit

        const Cards = await this._cardModel.find({
            filter:{},
            options:{limit,skip}
        })

        successResponse({res,message:"All Cards",data:Cards})
    }

    blockCard = async(req:Request,res:Response,next:NextFunction)=>{
       const {cardId} = req.params
        const Card = await this._cardModel.findOneAndUpdate({
            filter:{_id:cardId!},
            update: {status:cardStatus.blocked}
        } )
        if (!Card) {
            throw new AppError("Card Not Found",409)
        }
        successResponse({res,message:"Card Blocked Successfully"})
    }

    // transaction
    getAllTransaction = async(req:Request,res:Response,next:NextFunction)=>{
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 10
        const skip = (page - 1) * limit

        const Transactions = await this._transactionModel.find({
            filter:{},
            options:{limit,skip}
        })

        successResponse({res,message:"All Transactions",data:Transactions})
    }

    //Dashboard
    Dashboard = async(req:Request,res:Response,next:NextFunction)=>{
        const [user,account,card,transaction] =await Promise.all([
            this._userModel.find({ filter: {} }),
            this._accountModel.find({ filter: {} }),
            this._cardModel.find({ filter: {} }),
            this._transactionModel.find({ filter: {} })
        ])
        successResponse({res,
            message:"Your Dashboard",
            data:{
                TotalUsers:user.length,
                TotalAccounts:account.length,
                TotalCards:card.length,
                TotalTransactions:transaction.length
            }
        })
    }

}

export default new adminService ()