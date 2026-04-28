import * as z from "zod"


export const updatePasswordSchema = {
    body :z.object({
            password:z.string().regex(/^(?=.*[A-Za-z])(?=.*[^A-Za-z0-9]).{8,}$/,{
                message:"Password must contain at least one letter and one special character "
            }),
            nPassword:z.string().regex(/^(?=.*[A-Za-z])(?=.*[^A-Za-z0-9]).{8,}$/,{
                message:"Password must contain at least one letter and one special character"
            }),
            cPassword:z.string()
            }).refine((data) => data.nPassword === data.cPassword,{
                message:"Passwords do not match",
                path:["cPassword"]
            })
}


export const updateInfoSchema = {
    body :z.object({
            fullName:z.string().min(3).max(20),
        })
}