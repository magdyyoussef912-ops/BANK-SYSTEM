




import BaseRepository from "./base.repository";
import { Model } from "mongoose";
import accountModel, { IAccount } from "../DB/model/bankAccount.model";




class AccountRepository extends BaseRepository<IAccount>{
    constructor(protected readonly _model:Model<IAccount> = accountModel ){
        super(_model)
    }
}

export default  AccountRepository