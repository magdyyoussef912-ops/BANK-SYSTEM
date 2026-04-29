import { Router } from "express";
import { Authentication } from "../../common/middleware/authentication";
import { Authorization } from "../../common/middleware/authorization";
import { RoleEnum } from "../../common/enum/user.enum";
import adminService from "./admin.service";
import { Validation } from "../../common/middleware/validation";
import * as AV from "./admin.validation"
const adminRouter = Router()

adminRouter.use(Authentication,
    Authorization(RoleEnum.ADMIN)
)


// user
adminRouter.get("/users",Validation(AV.getAllUsersSchema),adminService.getAllUsers)
adminRouter.get("/user/:userId",Validation(AV.getUserSchema),adminService.getUser)
adminRouter.patch("/user/:userId/block",Validation(AV.blockUserSchema),adminService.blockUser)
adminRouter.patch("/user/:userId/unBlock",Validation(AV.unBlockUserSchema),adminService.UnblockUser)
adminRouter.delete("/user/:userId/delete",Validation(AV.deleteUserSchema),adminService.deleteUser)

// account
adminRouter.get("/accounts",Validation(AV.getAllAccountsSchema),adminService.getAllAccounts)
adminRouter.patch("/accounts/:accountId/block",Validation(AV.blockAccountsSchema),adminService.blockAccount)
adminRouter.patch("/accounts/:accountId/unBlock",Validation(AV.unBlockAccountsSchema),adminService.unBlockAccount)

//card
adminRouter.get("/cards",Validation(AV.getAllCardsSchema),adminService.getAllCards)
adminRouter.patch("/cards/:cardId/block",Validation(AV.blockCardSchema),adminService.blockCard)

// transaction
adminRouter.get("/transaction",Validation(AV.getAllTransactionSchema),adminService.getAllTransaction)

// DashBoard
adminRouter.get("/dashBoard",adminService.Dashboard)

export default adminRouter