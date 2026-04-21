import mongoose, { Document } from "mongoose";

import { RoleEnum } from "../../common/enum/user.enum";


export interface IUser extends Document {
    fullName:string,
    email:string,
    password:string,
    role : RoleEnum
    createdAt:Date,
    updatedAt:Date
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
        required:true,
        select:false
    },
    role:{
        type:String,
        enum:RoleEnum,
        default:RoleEnum.USER
    }
},{
    timestamps:true,
    strict:true,
    strictQuery:true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})




 const userModel = mongoose.models.user || mongoose.model<IUser>("user",userSchema)

export default userModel