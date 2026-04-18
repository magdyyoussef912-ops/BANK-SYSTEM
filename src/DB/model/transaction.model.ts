import mongoose, { Document } from "mongoose";
import { enumTransactionStatus, enumTransactionType } from "../../common/enum/transaction.enum";



export interface ITransaction extends Document {
    userId:mongoose.Types.ObjectId,
    accountId:mongoose.Types.ObjectId,
    amount:number,
    balanceBefore:number,
    balanceAfter:number,
    type:enumTransactionType,
    status:enumTransactionStatus,
    createdAt:Date,
    updatedAt:Date
}




const transactionSchema = new mongoose.Schema<ITransaction>({
    accountId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"account",
        required:true
    }, 
    balanceBefore:{
        type:Number,
        default:0
    },      
    balanceAfter:{
        type:Number,
        default:0
    },
    status:{
        type:String,
        enum:enumTransactionStatus,
        default:enumTransactionStatus.PENDING
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    type:{
        type:String,
        enum:enumTransactionType,
        required:true
    }
},{
    timestamps:true,
    strict:true,
    strictQuery:true
})




const transactionModel = mongoose.models.transaction || mongoose.model<ITransaction>("transaction",transactionSchema)

export default transactionModel