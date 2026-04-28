import { NextFunction, Request, Response } from "express"
import AccountRepository from "../account/account.repository"
import UserRepository from "../auth/user.repository"
import { AppError } from "../../common/utils/error.global.handler"
import { successResponse } from "../../common/utils/success.Responsive"
import { Compare, Hash } from "../../common/utils/security/hash.security"




class UserService {

    
    private readonly _userModel = new UserRepository()
    private readonly _accountModel = new AccountRepository()

    constructor() {}

    updateInfo = async (req:Request,res:Response,next:NextFunction) => {

        const {fullName} = req.body
        
        const user = await this._userModel.findOneAndUpdate({
            filter: { _id: req.user._id },
            update: {fullName},
        })
        if (!user) {
            throw new AppError("User Not Found",409)
        }
        successResponse({ res, message: "Your information updated successfully", data: user })
    }

    updatePassword = async (req:Request,res:Response,next:NextFunction) => {

        const {password,nPassword,cPassword} = req.body
        const user = await this._userModel.findOneWithPassword({
            filter: { _id: req.user._id }
        })
        if (!user) {
            throw new AppError("User Not Found",409)
        }
        if (!await Compare({plainText:password,cipherText:user.password})) {
            throw new AppError("Invalid password",401)
        }
        if (nPassword !== cPassword) {
            throw new AppError("Passwords do not match",401)
        }
        const hashNPassword = await Hash({plainText:nPassword})
        await this._userModel.findOneAndUpdate({
            filter: { _id: user._id },
            update: {password:hashNPassword},
        }) 
        successResponse({ res, message: "Your password updated successfully" })
    }

    getUser = async (req:Request,res:Response,next:NextFunction) => {
        const user = await this._userModel.findOne({
            filter:{_id:req.user._id} 
        })
        if (!user) {
            throw new AppError("user Not found",409) 
        }
        successResponse({res,message:"Your information",data:user})
    }

    getAllAccounts = async (req:Request,res:Response,next:NextFunction) => {
        const accounts = await this._accountModel.find({
            filter:{userId:req.user._id},
            options:{
                populate:[{path:"cards",select:'-_id -createdAt -updatedAt -__v'}]
            }
        })
        
        successResponse({res,message:"Your accounts",data:{user:req.user,accounts}})
    }

    deleteUser = async (req:Request,res:Response,next:NextFunction) => {

        const [user,accounts] = await Promise.all([
            this._userModel.findOne({
                filter:{_id:req.user._id}
            }),
            this._accountModel.find({
                filter:{userId:req.user._id,balance:{$gt:0}}
            })
        ])

        if (!user) {
            throw new AppError("user Not found",409) 
        }
        
        if (accounts.length >= 1) {
            throw new AppError("You have accounts with balance, please close them first",409)
        } 
        await Promise.all([
            this._userModel.findOneAndDelete({
                filter:{_id:req.user._id}
            }),
            this._accountModel.deleteMany({
                filter:{userId:req.user._id}
            })
        ])

        successResponse({res,message:"Your account deleted successfully"})
    }


    
}

export default new UserService()   