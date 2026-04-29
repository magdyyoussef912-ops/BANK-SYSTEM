import express, { NextFunction, Request, Response } from "express"
import cors from "cors"
import helmet from "helmet"
import rateLimit from "express-rate-limit"
import { AppError, globalErrorHandler } from "./common/utils/error.global.handler"
import { successResponse } from "./common/utils/success.Responsive"
import { PORT } from "./config/config.service"
import { checkConnectionDB } from "./DB/connectionDB"
import authRouter from "./modules/auth/auth.controller"
import accountRouter from "./modules/account/account.controller"
import transactionRouter from "./modules/transaction/transaction.controller"
import beneficiaryRouter from "./modules/beneficiary/beneficiary.controller"
import creditCardRouter from "./modules/card/card.controller"
import userRouter from "./modules/user/user.controller"
import redisService from "./common/service/redis.service"
import adminRouter from "./modules/admin/admin.controller"

const app = express()

const port = PORT

export const bootstrap = () => {

    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100,
        message: "Too many requests, please try again later",
        handler: (req: Request, res: Response) => {
            throw new AppError(`Too many requests, please try again later`, 429)
        },
        standardHeaders: true,
        legacyHeaders: false,
    })

    app.use(express.json(), cors(), helmet(), limiter)

    checkConnectionDB()

    redisService.connect()

    app.get("/", (req: Request, res: Response, next: NextFunction) => {
        successResponse({ res, message: "Welcome to the Bank System..." })
    })

    app.use("/auth", authRouter)
    app.use("/account", accountRouter)
    app.use("/transaction", transactionRouter)
    app.use("/beneficiary", beneficiaryRouter)
    app.use("/card", creditCardRouter)
    app.use("/user", userRouter)
    app.use("/admin", adminRouter)

    app.use("{/*demo}", (req: Request, res: Response, next: NextFunction) => {
        throw new AppError(`404 ${req.method} ${req.url} Not Found...`, 404)
    })

    app.use(globalErrorHandler)

    app.listen(port, () => {
        console.log(`server is running at port ${port} .......`);
    })

}
