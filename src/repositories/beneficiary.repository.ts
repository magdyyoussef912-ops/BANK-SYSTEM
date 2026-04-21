







import BaseRepository from "./base.repository";
import { Model } from "mongoose";
import beneficiaryModel, { IBeneficiary } from "../DB/model/beneficiary.model";




class BeneficiaryRepository extends BaseRepository<IBeneficiary>{
    constructor(protected readonly _model:Model<IBeneficiary> = beneficiaryModel ){
        super(_model)
    }
}

export default  BeneficiaryRepository