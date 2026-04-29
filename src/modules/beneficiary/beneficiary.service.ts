import { NextFunction, Request, Response } from "express";
import { AppError } from "../../common/utils/error.global.handler";
import { successResponse } from "../../common/utils/success.Responsive";
import { GenerateAccountNumber } from "../../common/enum/account.enum";
import BeneficiaryRepository from "./beneficiary.repository";
import UserRepository from "../auth/user.repository";
import AccountRepository from "../account/account.repository";
import  { startSession } from "mongoose";




class BeneficiaryService {

    private readonly _beneficiaryModel = new BeneficiaryRepository()
    private readonly _userModel = new UserRepository()
    private readonly _accountModel = new AccountRepository()

    constructor() { }

    createBeneficiary = async (req: Request, res: Response, next: NextFunction) => {
        const { accountNumber, bankName, nickName } = req.body;

        const beneficiaryExists = await this._beneficiaryModel.findOne({
            filter: { accountNumber }
        })
        if (beneficiaryExists) {
            throw new AppError("Beneficiary already exists", 400)
        }
        if (await this._accountModel.findOne({filter:{accountNumber}})) {
            throw new AppError("Account already exist",409) 
        }
        const user = await this._userModel.findOne({
            filter: { _id: req.user._id }
        }) 
        if (!user) {
            throw new AppError("User not found", 404)
        }

        const session = await startSession()
        
        try {
            session.startTransaction()
            
            const beneficiary = await this._beneficiaryModel.create({
                accountNumber,
                bankName,
                nickName,
                ownerUserId: req.user._id
            })
            const account = await this._accountModel.create({
                    accountNumber:beneficiary.accountNumber,
                    balance:0,
                    userId:beneficiary._id
            }) 
            await session.commitTransaction()

            successResponse({ res, message: "Beneficiary created successfully", data: {beneficiary,account} })

        } catch (error) {
            await session.abortTransaction()
            throw new AppError(error as string, 500)
            
        }   finally {
            session.endSession()
        }

    }

    getAllBeneficiary = async (req: Request, res: Response, next: NextFunction) => {
        const beneficiary = await this._beneficiaryModel.find({
            filter: { ownerUserId: req.user._id }
        })
        successResponse({ res, message: "Beneficiary fetched successfully", data: beneficiary })
    }

    deleteBeneficiary = async (req: Request, res: Response, next: NextFunction) => {
        const {id} = req.params
        const beneficiary = await this._beneficiaryModel.findOneAndDelete({
            filter: { _id: id,ownerUserId:req.user._id} as any
        }) 
        if(!beneficiary){
            throw new AppError("Beneficiary not found", 404)
        }
        successResponse({ res, message: "Beneficiary deleted successfully", data: beneficiary })
    }

}

export default new BeneficiaryService();