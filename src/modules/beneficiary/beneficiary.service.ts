import { NextFunction, Request, Response } from "express";
import { AppError } from "../../common/utils/error.global.handler";
import { successResponse } from "../../common/utils/success.Responsive";
import { GenerateAccountNumber } from "../../common/enum/account.enum";
import BeneficiaryRepository from "./beneficiary.repository";
import UserRepository from "../user/user.repository";




class BeneficiaryService {

    private readonly _beneficiaryModel = new BeneficiaryRepository()
    private readonly _userModel = new UserRepository()

    constructor(){}

    createBeneficiary = async (req:Request,res:Response,next:NextFunction) => {
        const {accountNumber,bankName,nickName} = req.body;

        const beneficiaryExists = await this._beneficiaryModel.findOne({
            filter:{accountNumber}
        })
        if (beneficiaryExists) {
            throw new AppError("Beneficiary already exists",400)
        }
        

        const user = await this._userModel.findOne({
            filter:{_id:req.user._id}
        })
        if (!user) {
            throw new AppError("User not found",404)
        }

        const beneficiary = await this._beneficiaryModel.create({
            accountNumber,
            bankName,
            nickName,
            ownerUserId:req.user._id
        })

        successResponse({res,message:"Beneficiary created successfully",data:beneficiary})
        
    } 
    
} 

export default new BeneficiaryService();