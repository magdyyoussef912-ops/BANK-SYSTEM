import { NextFunction, Request, Response } from "express"
import { AppError } from "../../common/utils/error.global.handler"
import { Compare, Hash } from "../../common/utils/security/hash.security"
import { successResponse } from "../../common/utils/success.Responsive"
import { randomUUID } from "node:crypto"
import { GenerateToken, VerfiyToken } from "../../common/utils/security/token.service"
import { ACCESS_TOKEN_EXPIRY, ACCESS_TOKEN_KEY, CLIENT_ID, PREFIX, REFRESH_TOKEN_EXPIRY, REFRESH_TOKEN_KEY} from "../../config/config.service"
import AccountRepository from "../account/account.repository"
import UserRepository from "./user.repository"
import redisService from "../../common/service/redis.service"
import { EmailEnum, ProviderEnum } from "../../common/enum/user.enum"
import { generateOtp, sendEmail } from "../../common/utils/email/sendEmail"
import { eventEmitter } from "../../common/utils/email/email.events"
import { bankEmailTemplate } from "../../common/utils/email/email.Template"
import { sendEmailOtp } from "../../common/utils/email/sendEmailOtp"
import { ISignUpType, ISignInType, IconfirmEmailType, IresendOtpType, IforgetPasswordType, IresetPasswordType } from "./auth.dto"
import { OAuth2Client, TokenPayload } from "google-auth-library"


class AuthService {

    private readonly _userModel = new UserRepository()
    private readonly _accountModel = new AccountRepository()
    private readonly _redisService = redisService

    constructor() { }

    signUP = async (req: Request, res: Response, next: NextFunction) => {
        const { fullName, email, password  } : ISignUpType = req.body

        if (await this._userModel.findOne({ filter: { email } })) {
            throw new AppError("User already exists", 409)
        }

        const user = await this._userModel.create({
            fullName,
            email,
            password: await Hash({ plainText: password }),
        })
        const otp = await generateOtp()
        eventEmitter.emit(EmailEnum.confirmEmail,async ()=>{
            await sendEmail({to:email,subject:"Welcome in Bank System",html:bankEmailTemplate(otp)})
        })

        const value= await Hash({plainText:`${otp}`})
        

        await this._redisService.setValue( { key: this._redisService.otp_key ( { email, subject : EmailEnum.confirmEmail } ) ,value, ttl:60*10})
        await this._redisService.setValue({key:this._redisService.max_otp_key({email}),value:1,ttl:30})
        
        successResponse({ res, message: "User created successfully", data: { user } })


    }

    SignUpWithGmail = async (req: Request, res: Response, next: NextFunction) => {
        const {idToken}  = req.body
        const client = new OAuth2Client();

        const ticket = await client.verifyIdToken({
            idToken,
            audience: CLIENT_ID,  
        });
        const payload = ticket.getPayload();

        const {name,email,email_verified} : TokenPayload  | undefined = payload!

        let user = await this._userModel.findOne({
            filter:{email:payload?.email!}
        })

        if (!user) {
            user = await this._userModel.create({
                    fullName:name as string,
                    email:email as string,
                    confirmed:email_verified as boolean,
                    provider:ProviderEnum.Google
            })
        }

        if (user.provider == ProviderEnum.System) {
            throw new AppError("Plz log in with system",409)
        }

        const jwtid =  randomUUID()

        const access_token = GenerateToken({
            payload:{id:user._id , email : email as string },
            secretOrPrivateKey:ACCESS_TOKEN_KEY,
            options:{
                expiresIn:"1day",
                jwtid
            }
        })
        

        successResponse({ res, message: "Sign In successful",data:access_token })

    }

    signIN = async (req: Request, res: Response, next: NextFunction) => {
        const { email, password } : ISignInType = req.body

        const user = await this._userModel.findOneWithPassword( { email, provider:ProviderEnum.System ,confirmed:{$exists:true}} )
        if (!user) {
            throw new AppError("User not found or not provider", 404)
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
                expiresIn: ACCESS_TOKEN_EXPIRY as any, 
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
                expiresIn: REFRESH_TOKEN_EXPIRY as any,
                jwtid
            }
        })
        
        successResponse({ res, message: "User logged in successfully", data: { access_token, refresh_token } })


    }

    confirmEmail = async (req: Request, res: Response, next: NextFunction) => {
        const {email,code} : IconfirmEmailType = req.body
        
        
        const otpValue = await this._redisService.get(this._redisService.otp_key({email,subject:EmailEnum.confirmEmail}))
        if (!otpValue) {
            throw new AppError("Otp Expired",409);            
        }
        

        if (!await Compare ({ plainText: `${code}` , cipherText:otpValue })) {
            throw new AppError("inValid Otp",409);
        }

        const user = await this._userModel.findOneAndUpdate({
            filter:{email,confirmed:{$exists:false}},
            update:{confirmed:true}
        })
        
        if (!user) {
            throw new AppError("user Not Exist",409)
        }

        await this._redisService.del(this._redisService.otp_key({email,subject:EmailEnum.confirmEmail}))

        successResponse({res,message:"Email Confirmed successfully"})

    }

    resendOtp = async  (req: Request, res: Response, next: NextFunction)=>{
        const {email} : IresendOtpType = req.body

        const user = await this._userModel.findOne({
            filter:{email,confirmed:{$exists:false}}
        })

        if (!user) {
            throw new AppError("user Not Exist or already confirmed",409)
        }

        await sendEmailOtp({email,subject:EmailEnum.confirmEmail})

        successResponse({res,message:"Otp Sent"})
    }

     forgetPassword = async (req: Request, res: Response, next: NextFunction)=>{
        const {email} :IforgetPasswordType = req.body

        const user = await this._userModel.findOne({
            filter:{email,confirmed:{$exists:true}}
        })
        if (!user) {
            throw new AppError("User Not Found",409)
        }

        await sendEmailOtp({email,subject:EmailEnum.forgetPassword})

        successResponse({res,message:"otp Sent"})
    }

    resetPassword = async  (req: Request, res: Response, next: NextFunction)=>{
        const {email,code,nPassword} :IresetPasswordType = req.body
        
        const otpValue = await this._redisService.get(this._redisService.otp_key({email,subject:EmailEnum.forgetPassword}))
        if (!otpValue) {
            throw new AppError("Otp Expired")
        }

        if (!await Compare ({ plainText:`${code}`,cipherText:otpValue })) {
            throw new AppError("inValid Otp")
        }

        const user = await this._userModel.findOneAndUpdate({
            filter:{email,confirmed:{$exists:true}},
            update:{password:await Hash({plainText:nPassword})}
        })
        if (!user) {
            throw new AppError("User Not Found or not confirmed",409)
        }

        await this._redisService.del(this._redisService.otp_key({email,subject:EmailEnum.forgetPassword}))

        successResponse({res,message:"Password reset successfully"})
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
                    expiresIn: ACCESS_TOKEN_EXPIRY as any,
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



