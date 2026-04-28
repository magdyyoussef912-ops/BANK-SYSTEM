import * as z from "zod"
import { cardType } from "../../common/enum/creditcard.enum"
import { Types } from "mongoose"




export const addCaredSchema = {
    body : z.object({
        bankName: z.string().min(3,"Bank Name Must Be 3 Character"),
        cardType: z.enum(cardType).default(cardType.visa),
        password: z.string().min(4,"Password Must Be 4 Character").max(4,"Password Must Be 4 Character").trim(),
        cardNumber: z.string().length(16,"Card Number Must Be 16 Character").optional(),
    })
} 
 

export const delCardSchema = {
    params : z.object({
        cardId: z.string().refine((val) => Types.ObjectId.isValid(val), { message: "Invalid Card ID" }),
    })
} 
 

export const setDefaultCardSchema = {
    params : z.object({
        cardId: z.string().refine((val) => Types.ObjectId.isValid(val), { message: "Invalid Card ID" }),
    })
} 