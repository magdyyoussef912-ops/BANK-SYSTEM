import { Router } from "express";
import { Validation } from "../../common/middleware/validation";
import * as UV  from "./auth.validation";
import authService from "./auth.service";
import { Authentication } from "../../common/middleware/authentication";
const authRouter = Router({strict:true})


authRouter.post("/register",Validation(UV.signupSchema),authService.signUP)
authRouter.post("/login",Validation(UV.signinSchema),authService.signIN)
authRouter.post("/refresh-token",authService.refreshToken)
authRouter.post("/logout",Authentication,authService.logOut)



export default authRouter 