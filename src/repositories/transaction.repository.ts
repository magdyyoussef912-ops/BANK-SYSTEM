




import BaseRepository from "./base.repository";
import { Model } from "mongoose";
import transactionModel, { ITransaction } from "../DB/model/transaction.model";




class TransactionRepository extends BaseRepository<ITransaction>{
    constructor(protected readonly _model:Model<ITransaction> = transactionModel ){
        super(_model)
    }
}

export default  TransactionRepository