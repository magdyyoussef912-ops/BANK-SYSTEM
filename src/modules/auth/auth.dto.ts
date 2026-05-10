import z from "zod"
import { confirmEmailSchema, forgetPasswordSchema, resendOtpSchema, resetPasswordSchema, signupSchema, signinSchema } from "./auth.validation"


export type ISignUpType = z.infer<typeof signupSchema.body>
export type ISignInType = z.infer<typeof signinSchema.body>
export type IconfirmEmailType = z.infer<typeof confirmEmailSchema.body>
export type IresendOtpType = z.infer<typeof resendOtpSchema.body>
export type IforgetPasswordType = z.infer<typeof forgetPasswordSchema.body>
export type IresetPasswordType = z.infer<typeof resetPasswordSchema.body>