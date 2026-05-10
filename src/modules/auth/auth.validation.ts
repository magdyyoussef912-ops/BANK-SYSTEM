import * as z from "zod"

export const signupSchema = {
    body :z.object({
            fullName:z.string().min(3).max(25),
            email:z.string().email(),
            password:z.string().regex(/^(?=.*[A-Za-z])(?=.*[^A-Za-z0-9]).{8,}$/,{
                message:"Password must contain at least one letter and one special character"
            }),
        })
}


export const signinSchema = {
    body :z.object({
            email:z.string().email(),
            password:z.string().regex(/^(?=.*[A-Za-z])(?=.*[^A-Za-z0-9]).{8,}$/,{
                message:"Password must contain at least one letter and one special character"
            }),
        })
}

export const confirmEmailSchema = {
    body :z.object({
            email : z.string().email(),
            code : z.string().min(6).max(6).regex(/^\d{6}$/)
        })
}


export const resendOtpSchema = {
    body : z.object({
        email : z.string().email(),
    })
} 



export const forgetPasswordSchema = {
    body : z.object({
        email : z.string().email(),
    })
} 


export const resetPasswordSchema = {
    body : z.object({
        email : z.string().email(),
        code: z.string().regex(/^\d{6}$/),
        nPassword:z.string().regex(/^(?=.*[A-Za-z])(?=.*[^A-Za-z0-9]).{8,}$/)
    }) 
}



