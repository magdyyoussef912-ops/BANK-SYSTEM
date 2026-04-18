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
