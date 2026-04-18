import { Types } from "mongoose";
import * as z from "zod";



export const depositSchema = {
    body : z.object({
        amount:z.number().min(50,"Amount must be greater than 50")
    })
}   

export const withdrawSchema = {
    body : z.object({
        amount:z.number().min(50,"Amount must be greater than 50")
    })
}

export const singleTransactionSchema = {
    params : z.object({
        id:z.string().refine(
            (val) => Types.ObjectId.isValid(val),
            { message: "Invalid Transaction ID" }
        )
    })
}