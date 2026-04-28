import mongoose from "mongoose";
import { cardStatus, cardType } from "../../common/enum/creditcard.enum";



export interface ICreditCard {
    accountId:mongoose.Types.ObjectId
    userId:mongoose.Types.ObjectId
    bankName:string
    cardType:cardType
    status:cardStatus
    cardNumber:string
    password:string
    default:boolean
}

const CreditCardSchema = new mongoose.Schema<ICreditCard>({
    accountId:{
        type:mongoose.Types.ObjectId,
        ref:'Account'
    },
    userId:{
        type:mongoose.Types.ObjectId,
        ref:'User'
    },
    bankName:{
        type:String,
        required:true
    },
    cardType:{
        type:String,
        enum:cardType,
        required:true,
        default:cardType.visa
    },
    status:{
        type:String,
        enum:cardStatus,
        required:true,
        default:cardStatus.active
    },
    cardNumber:{
        type:String,
        unique:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
        select:false,
        min:4,
        max:4,
    },
    default:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
})

const CreditCard =mongoose.models.CreditCard || mongoose.model<ICreditCard>('CreditCard',CreditCardSchema)

export default CreditCard