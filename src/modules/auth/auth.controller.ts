import { Router } from "express";
import { Validation } from "../../common/middleware/validation";
import * as UV  from "./auth.validation";
import authService from "./auth.service";
import { Authentication } from "../../common/middleware/authentication";
const authRouter = Router({strict:true})


authRouter.post("/register",Validation(UV.signupSchema),authService.signUP)

authRouter.post("/signup/gmail",authService.SignUpWithGmail)

authRouter.post("/login",Validation(UV.signinSchema),authService.signIN)

authRouter.post("/confirm-email",Validation(UV.confirmEmailSchema),authService.confirmEmail)

authRouter.post("/resend-otp",Validation(UV.resendOtpSchema),authService.resendOtp)

authRouter.post("/forget-password",Validation(UV.forgetPasswordSchema),authService.forgetPassword)

authRouter.post("/reset-password",Validation(UV.resetPasswordSchema),authService.resetPassword)

authRouter.post("/refresh-token",authService.refreshToken)

authRouter.post("/logout",Authentication,authService.logOut)



export default authRouter 