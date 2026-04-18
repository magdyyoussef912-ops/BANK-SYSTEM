import { Router } from "express";
import AccountService from "./account.service";
import { Authentication } from "../../common/middleware/authentication";

const accountRouter =  Router()

accountRouter.get("/me",Authentication,AccountService.getAccount)

export default accountRouter
