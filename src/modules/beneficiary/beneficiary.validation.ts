import * as z from "zod";



export const createBeneSchema = {
    body : z.object({
        accountNumber:z.string(),
        bankName:z.string(),
        nickName:z.string()
    })
}