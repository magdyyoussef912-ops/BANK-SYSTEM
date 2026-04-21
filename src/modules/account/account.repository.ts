




import { Model } from "mongoose";
import BaseRepository from "../../repositories/base.repository";
import accountModel, { IAccount } from "../../DB/model/bankAccount.model";




class AccountRepository extends BaseRepository<IAccount>{
    constructor(protected readonly _model:Model<IAccount> = accountModel ){
        super(_model)
    }
}

export default  AccountRepository