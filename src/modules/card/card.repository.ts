import { Model } from "mongoose";
import CreditCard, { ICreditCard } from "../../DB/model/creditCard.model";
import BaseRepository from "../../repositories/base.repository";






class cardRepository extends BaseRepository<ICreditCard>{
    constructor(protected readonly _model:Model<ICreditCard> = CreditCard){
        super(_model)
    }
   
}
export default  cardRepository