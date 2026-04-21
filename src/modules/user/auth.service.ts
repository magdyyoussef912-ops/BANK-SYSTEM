import { NextFunction, Request, Response } from "express"
import { AppError } from "../../common/utils/error.global.handler"
import { Compare, Hash } from "../../common/utils/security/hash.security"
import { successResponse } from "../../common/utils/success.Responsive"
import { randomUUID } from "node:crypto"
import { GenerateToken } from "../../common/utils/security/token.service"
import { ACCESS_TOKEN_KEY} from "../../config/config.service"
import { enumCurrency, enumStatusAccount, GenerateAccountNumber } from "../../common/enum/account.enum"
import AccountRepository from "../account/account.repository"
import UserRepository from "./user.repository"


class AuthService {

    private readonly _userModel = new UserRepository()
    private readonly _accountModel = new AccountRepository()

    constructor() { }

    signUP = async (req: Request, res: Response, next: NextFunction) => {
        const { fullName, email, password, accountNumber } = req.body

        if (await this._userModel.findOne({ filter: { email } })) {
            throw new AppError("User already exists", 409)
        }

        const user = await this._userModel.create({
            fullName,
            email,
            password: await Hash({ plainText: password })
        })

        if (accountNumber) {
            if (await this._accountModel.findOne({ filter: { accountNumber } })) {
                throw new AppError("Account Number already exists", 409)
            }
        }


        const account = await this._accountModel.create({
            userId: user._id,
            accountNumber: accountNumber || GenerateAccountNumber(),
            balance: 0,
            currency: enumCurrency.EGP,
            status: enumStatusAccount.ACTIVE
        })

        successResponse({ res, message: "User created successfully", data: { user, account } })


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
                expiresIn: "7days",
                jwtid
            }
        })


        successResponse({ res, message: "User logged in successfully", data: access_token })


    }



}

export default new AuthService()