


import { HydratedDocument, Model, QueryFilter } from "mongoose";
import BaseRepository from "../../repositories/base.repository";
import userModel, { IUser } from "../../DB/model/user.model";




class UserRepository extends BaseRepository<IUser>{
    constructor(protected readonly _model:Model<IUser> = userModel){
        super(_model)
    }
    async findOneWithPassword(filter: QueryFilter<IUser>): Promise<HydratedDocument<IUser> | null> {
        return this._model.findOne(filter).select('+password')
    }
}

export default  UserRepository