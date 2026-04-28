import { Router } from "express";
import { Authentication } from "../../common/middleware/authentication";
import { Validation } from "../../common/middleware/validation";
import userService from "./user.service";
import  * as UV from "./user.validation"

const userRouter = Router()
 



userRouter.get("/me",Authentication,userService.getUser)
userRouter.get("/me/accounts",Authentication,userService.getAllAccounts)
userRouter.patch("/update-info",Authentication,Validation(UV.updateInfoSchema),userService.updateInfo)
userRouter.patch("/update-password",Authentication,Validation(UV.updatePasswordSchema),userService.updatePassword)
userRouter.delete("/me",Authentication,userService.deleteUser)



export default userRouter