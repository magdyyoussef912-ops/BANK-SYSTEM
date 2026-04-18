import { Router } from "express";
import transactionService from "./transaction.service";
import { Validation } from "../../common/middleware/validation";
import * as TV from "./transaction.validation"
import { Authentication } from "../../common/middleware/authentication";

const transactionRouter =  Router()


transactionRouter.patch("/deposit",Authentication,Validation(TV.depositSchema),transactionService.deposit)
transactionRouter.patch("/withdraw",Authentication,Validation(TV.withdrawSchema),transactionService.withdraw)
transactionRouter.get("/my",Authentication,transactionService.getAllTransactions)
transactionRouter.get("/:id",Validation(TV.singleTransactionSchema),transactionService.getSingleTransaction)
 

export default transactionRouter
