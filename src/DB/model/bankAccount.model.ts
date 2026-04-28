import mongoose, { Document } from "mongoose";
import { enumCurrency, enumStatusAccount } from "../../common/enum/account.enum";



export interface IAccount extends Document {
    userId:mongoose.Types.ObjectId,
    accountNumber:string,
    balance:number,
    currency:string,
    status:string,
    createdAt:Date,
    updatedAt:Date
    default:boolean,
}




const accountSchema = new mongoose.Schema<IAccount>({
    accountNumber:{
        type:String,
        required:true,
        unique:true
    }, 
    balance:{
        type:Number,
        default:0
    },      
    currency:{
        type:String,
        enum:enumCurrency,
        default:enumCurrency.EGP
    },
    status:{
        type:String,
        enum:enumStatusAccount,
        default:enumStatusAccount.ACTIVE
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    default:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true,
    strict:true,
    strictQuery:true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})

accountSchema.virtual('cards', {
  ref: 'CreditCard',
  localField: '_id',
  foreignField: 'accountId'
});


const accountModel = mongoose.models.account || mongoose.model<IAccount>("account",accountSchema)

export default accountModel