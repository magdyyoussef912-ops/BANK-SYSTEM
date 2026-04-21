






import { Model } from "mongoose";
import BaseRepository from "../../repositories/base.repository";
import beneficiaryModel, { IBeneficiary } from "../../DB/model/beneficiary.model";




class BeneficiaryRepository extends BaseRepository<IBeneficiary>{
    constructor(protected readonly _model:Model<IBeneficiary> = beneficiaryModel ){
        super(_model)
    }
}

export default  BeneficiaryRepository