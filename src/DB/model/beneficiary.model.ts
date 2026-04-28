import mongoose, { Document } from "mongoose";



export interface IBeneficiary extends Document {
    ownerUserId:mongoose.Types.ObjectId,
    accountNumber:string,
    bankName:string,
    nickName:string,
}




const beneficiarySchema = new mongoose.Schema<IBeneficiary>({
    accountNumber:{
        type:String,
        required:true,
        unique:true
    }, 
    bankName:String,      
    nickName:String,
    ownerUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    }
},{
    strict:true,
    strictQuery:true
})




const beneficiaryModel = mongoose.models.beneficiary || mongoose.model<IBeneficiary>("beneficiary",beneficiarySchema)

export default beneficiaryModel