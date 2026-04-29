import { NextFunction, Request, Response } from "express"
import cardRepository from "./card.repository"
import AccountRepository from "../account/account.repository"
import { AppError } from "../../common/utils/error.global.handler"
import { enumCurrency, enumStatusAccount, GenerateAccountNumber } from "../../common/enum/account.enum"
import { Hash } from "../../common/utils/security/hash.security"
import { generateCardNumber } from "../../common/enum/creditcard.enum"
import { successResponse } from "../../common/utils/success.Responsive"
import mongoose from "mongoose"
import { IAddCardType } from "./card.dto"




class cardService{

    private readonly _cardModel = new cardRepository()
    private readonly _accountModel =new  AccountRepository()

    constructor(){}

 
    addCard = async (req:Request,res:Response,next:NextFunction) => {
        const {bankName,cardType,cardNumber,password} : IAddCardType  = req.body

        if (cardNumber && await this._cardModel.findOne({filter:{cardNumber}})) {
            throw new AppError("Card Number already exists", 409)
        }

        
        const session = await mongoose.startSession()
        

        try {
            session.startTransaction()
            const account = await this._accountModel.create({
                userId: req.user._id,
                accountNumber: GenerateAccountNumber(),
                balance: 0,
                currency: enumCurrency.EGP,
                status: enumStatusAccount.ACTIVE
            })
    
            const card = await this._cardModel.create({
                accountId:account._id,
                userId: req.user._id,
                bankName,
                cardType,
                cardNumber:cardNumber || generateCardNumber(),
                password:await Hash({plainText:password})
            })

            await session.commitTransaction()
            successResponse({ res, message: "Card created successfully", data: {card,account} })
        } catch (error) {
            await session.abortTransaction()
            throw new AppError(error as string, 500)
        } finally {
            await session.endSession()
        }


    } 

    deleteCard = async (req:Request,res:Response,next:NextFunction) => {

        const {cardId} = req.params

        const card = await this._cardModel.findOne({filter:{_id:cardId,userId:req.user._id}})
        if (!card) {
            throw new AppError("Card Not Found or You don't have access", 404)
        }
        
        const session = await mongoose.startSession()

        try {
            session.startTransaction()
            await this._accountModel.deleteOne({filter:{_id:card.accountId}})
            await this._cardModel.deleteOne({filter:{_id:cardId}})
            await session.commitTransaction()
            successResponse({ res, message: "Card deleted successfully" })
        } catch (error) {
            await session.abortTransaction()
            throw new AppError(error as string, 500)
        } finally {
            await session.endSession()
        }
        

    }
    
    getAllCards = async (req:Request,res:Response,next:NextFunction) => {

        const cards = await this._cardModel.find({
            filter:{userId:req.user._id}
        })
        successResponse({ res, message: "Your Cards", data: cards })

    }

    setDefaultCard = async (req:Request,res:Response,next:NextFunction) => {

        const {cardId} = req.params
        
        const card = await this._cardModel.findOne({filter:{_id:cardId}}) 
        
        if (!card) {
            throw new AppError("Card Not Found", 404)
        }
        
        const session = await mongoose.startSession()
  
        try {
            session.startTransaction()  
            await this._cardModel.updateMany({filter:{userId:req.user._id},update:{default:false}})
            await this._accountModel.updateMany({filter:{userId:req.user._id},update:{default:false}})
            await this._accountModel.updateOne({filter:{_id:card.accountId},update:{default:true}})
            await this._cardModel.updateOne({filter:{_id:cardId},update:{default:true}})
            await session.commitTransaction()
            successResponse({ res, message: "Card set as default successfully" })
        } catch (error) { 
            await session.abortTransaction()
            throw new AppError(error as string, 500) 
        } finally {
            await session.endSession()
        }
    }
    
}

export default new cardService()