import mongoose, { Document } from "mongoose";

import { ProviderEnum, RoleEnum, StatusEnumUser } from "../../common/enum/user.enum";


export interface IUser extends Document {
    fullName:string,
    email:string,
    password:string,
    role : RoleEnum
    createdAt:Date,
    updatedAt:Date
    changeCredential:Date
    status:StatusEnumUser,
    provider:ProviderEnum,
    confirmed:boolean
}




const userSchema = new mongoose.Schema<IUser>({
    fullName:{
        type:String,
        minLength:8,
        maxLength:30,
        required:true
    }, 
    email:{
        type:String,
        trim:true,
        unique:true,
        required:true
    },
    password:{
        type:String,
        trim:true,
        required:function(){
            if (this.provider === ProviderEnum.System) {
                return true
            }
            return false
        },
        select:false
    },
    role:{
        type:String,
        enum:RoleEnum,
        default:RoleEnum.USER
    },
    changeCredential:Date,
    status:{
        type:String,
        enum:StatusEnumUser,
        default:StatusEnumUser.Active
    },
    provider:{
        type:String,
        enum:ProviderEnum,
        default:ProviderEnum.System
    },
    confirmed:Boolean
},{
    timestamps:true,
    strict:true,
    strictQuery:true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})




 const userModel = mongoose.models.user || mongoose.model<IUser>("user",userSchema)

export default userModel