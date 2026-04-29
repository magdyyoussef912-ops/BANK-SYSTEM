import { Types } from "mongoose"
import * as z from "zod"

// user
export const getAllUsersSchema= {
    query : z.object({
        limit:z.string().optional(),
        page:z.string().optional(),
    })
}

export const getUserSchema= {
    params : z.object({
        userId:z.string().refine((val :any) => Types.ObjectId.isValid(val), { message: "Invalid user ID" }),
    })
}

export const blockUserSchema= {
    params : z.object({
        userId:z.string().refine((val :any) => Types.ObjectId.isValid(val), { message: "Invalid user ID" }),
    })
}

export const unBlockUserSchema= {
    params : z.object({
        userId:z.string().refine((val :any) => Types.ObjectId.isValid(val), { message: "Invalid user ID" }),
    })
}

export const deleteUserSchema= {
    params : z.object({
        userId:z.string().refine((val :any) => Types.ObjectId.isValid(val), { message: "Invalid user ID" }),
    })
}



// Accounts

export const getAllAccountsSchema= {
    query : z.object({
        limit:z.string(),
        page:z.string(),
    })
}



export const unBlockAccountsSchema= {
    params : z.object({
        accountId:z.string().refine((val :any) => Types.ObjectId.isValid(val), { message: "Invalid user ID" }),
    })
}

export const blockAccountsSchema= {
    params : z.object({
        accountId:z.string().refine((val :any) => Types.ObjectId.isValid(val), { message: "Invalid user ID" }),
    })
    
}

//Cards

export const getAllCardsSchema= {
    query : z.object({
        limit:z.string(),
        page:z.string(),
    })
}


export const blockCardSchema= {
    params : z.object({
        cardId:z.string().refine((val :any) => Types.ObjectId.isValid(val), { message: "Invalid user ID" }),
    })
    
}


// Transaction
export const getAllTransactionSchema= {
    query : z.object({
        limit:z.string(),
        page:z.string(),
    })
}