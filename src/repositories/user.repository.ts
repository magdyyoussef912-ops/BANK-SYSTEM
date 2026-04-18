import { IUser } from "../DB/model/user.model";
import BaseRepository from "./base.repository";

import userModel from "../DB/model/user.model";
import { Model } from "mongoose";




class UserRepository extends BaseRepository<IUser>{
    constructor(protected readonly _model:Model<IUser> = userModel){
        super(_model)
    }
}

export default  UserRepository