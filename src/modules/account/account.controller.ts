import { Router } from "express";
import AccountService from "./account.service";
import { Authentication } from "../../common/middleware/authentication";
import { Validation } from "../../common/middleware/validation";
import  * as AV from "./account.validation"
const accountRouter =  Router()


accountRouter.post("/create",Authentication,AccountService.create)
accountRouter.get("/me",Authentication,AccountService.getAccount)
accountRouter.get("/status",Authentication,Validation(AV.statusSchema),AccountService.status)

export default accountRouter
