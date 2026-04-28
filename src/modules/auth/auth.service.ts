import { NextFunction, Request, Response } from "express"
import { AppError } from "../../common/utils/error.global.handler"
import { Compare, Hash } from "../../common/utils/security/hash.security"
import { successResponse } from "../../common/utils/success.Responsive"
import { randomUUID } from "node:crypto"
import { GenerateToken, VerfiyToken } from "../../common/utils/security/token.service"
import { ACCESS_TOKEN_KEY, PREFIX, REFRESH_TOKEN_KEY} from "../../config/config.service"
import AccountRepository from "../account/account.repository"
import UserRepository from "./user.repository"
import { enumCurrency, enumStatusAccount, GenerateAccountNumber } from "../../common/enum/account.enum"
import redisService from "../../common/service/redis.service"


class AuthService {

    private readonly _userModel = new UserRepository()
    private readonly _accountModel = new AccountRepository()
    private readonly _redisService = redisService

    constructor() { }

    signUP = async (req: Request, res: Response, next: NextFunction) => {
        const { fullName, email, password ,accountNumber } = req.body

        if (await this._userModel.findOne({ filter: { email } })) {
            throw new AppError("User already exists", 409)
        }

        const user = await this._userModel.create({
            fullName,
            email,
            password: await Hash({ plainText: password })
        })

        // if (accountNumber) {
        //     if (await this._accountModel.findOne({ filter: { accountNumber } })) {
        //         throw new AppError("Account Number already exists", 409)
        //     }
        // }


        // const account = await this._accountModel.create({
        //     userId: user._id,
        //     accountNumber: accountNumber || GenerateAccountNumber(),
        //     balance: 0,
        //     currency: enumCurrency.EGP,
        //     status: enumStatusAccount.ACTIVE
        // })

        // successResponse({ res, message: "User created successfully", data: { user, account } })

        successResponse({ res, message: "User created successfully", data: { user } })


    }


    signIN = async (req: Request, res: Response, next: NextFunction) => {
        const { email, password } = req.body

        const user = await this._userModel.findOneWithPassword({ filter: { email } })
        if (!user) {
            throw new AppError("User not found", 404)
        }

        if (!await Compare({ plainText: password, cipherText: user.password })) {
            throw new AppError("Invalid password", 401)
        }

        const jwtid = randomUUID()
        const access_token = GenerateToken({
            payload: {
                id: user._id,
                email: user.email
            },
            secretOrPrivateKey: ACCESS_TOKEN_KEY,
            options: {
                expiresIn: "1d",
                jwtid
            }
        })

        const refresh_token = GenerateToken({
            payload: {
                id: user._id,
                email: user.email
            },
            secretOrPrivateKey: REFRESH_TOKEN_KEY,
            options: {
                expiresIn: "1d",
                jwtid
            }
        })


        successResponse({ res, message: "User logged in successfully", data: { access_token, refresh_token } })


    }

    refreshToken = async (req: Request, res: Response, next: NextFunction) => {
        const { authorization } = req.headers
            if (!authorization) {
                throw new AppError("Token Not Found",404)
            }
            const [prefix, token]: string[] = authorization.split(" ")
            if (prefix !== PREFIX) {
                throw new AppError("inValid Prefix",401)
            }
            const decoded = VerfiyToken({ token: token!, secretOrPublicKey: REFRESH_TOKEN_KEY })
            if (!decoded || typeof decoded !== "object" || !("id" in decoded)) {
                throw new AppError("inValid token payload",401)
            }
        
            const user = await this._userModel.findOne({ filter: { _id: decoded.id } })
            if (!user) {
                throw new AppError("User Not Found", 409)
            }

            const jwtid = randomUUID()
            const access_token = GenerateToken({
                payload: {
                    id: user._id,
                    email: user.email
                },
                secretOrPrivateKey: ACCESS_TOKEN_KEY,
                options: {
                    expiresIn: "15m",
                    jwtid
                }
            })

    

        successResponse({ res, message: "Token refreshed successfully", data:  {access_token}  })


    }


    logOut = async (req:Request,res:Response,next:NextFunction)=>{
        const {flag} = req.query
        
        if (flag == "All") {
            req.user.changeCredential = new Date()
            await req.user.save()
            const revoked_tokens = await this._redisService.keys(this._redisService.revoked_id_token({userId:req.decoded.id!})) 
            if (revoked_tokens && revoked_tokens.length >0) {
                await Promise.all(revoked_tokens.map(key => this._redisService.del(key)))
            }
        }else{
            await this._redisService.setValue({
                key: this._redisService.revoked_token({
                    userId:req.decoded.id!,
                    jti:req.decoded.jti!,
                }),
                value:`${req.decoded.id}`,
                ttl: req.decoded.exp! - Math.floor(Date.now()/1000)
            })
        }
        await req.user.save() 
        successResponse({res,message:"User logged out successfully"})
        
    }



}

export default new AuthService()   



