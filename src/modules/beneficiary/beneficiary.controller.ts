import { Router } from "express";
import BeneficiaryService from "./beneficiary.service";
import { Authentication } from "../../common/middleware/authentication";
import { Validation } from "../../common/middleware/validation";
import * as BV from "./beneficiary.validation"

const beneficiaryRouter = Router();


beneficiaryRouter.post("/addBeneficiary",Authentication,Validation(BV.createBeneSchema),BeneficiaryService.createBeneficiary)
beneficiaryRouter.get("/getAllBeneficiary",Authentication,BeneficiaryService.getAllBeneficiary)
beneficiaryRouter.delete("/deleteBeneficiary/:id",Authentication,BeneficiaryService.deleteBeneficiary)


export default beneficiaryRouter; 