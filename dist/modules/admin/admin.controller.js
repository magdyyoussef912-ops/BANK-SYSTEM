"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authentication_1 = require("../../common/middleware/authentication");
const authorization_1 = require("../../common/middleware/authorization");
const user_enum_1 = require("../../common/enum/user.enum");
const admin_service_1 = __importDefault(require("./admin.service"));
const validation_1 = require("../../common/middleware/validation");
const AV = __importStar(require("./admin.validation"));
const adminRouter = (0, express_1.Router)();
adminRouter.use(authentication_1.Authentication, (0, authorization_1.Authorization)(user_enum_1.RoleEnum.ADMIN));
adminRouter.get("/users", (0, validation_1.Validation)(AV.getAllUsersSchema), admin_service_1.default.getAllUsers);
adminRouter.get("/user/:userId", (0, validation_1.Validation)(AV.getUserSchema), admin_service_1.default.getUser);
adminRouter.patch("/user/:userId/block", (0, validation_1.Validation)(AV.blockUserSchema), admin_service_1.default.blockUser);
adminRouter.patch("/user/:userId/unBlock", (0, validation_1.Validation)(AV.unBlockUserSchema), admin_service_1.default.UnblockUser);
adminRouter.delete("/user/:userId/delete", (0, validation_1.Validation)(AV.deleteUserSchema), admin_service_1.default.deleteUser);
adminRouter.get("/accounts", (0, validation_1.Validation)(AV.getAllAccountsSchema), admin_service_1.default.getAllAccounts);
adminRouter.patch("/accounts/:accountId/block", (0, validation_1.Validation)(AV.blockAccountsSchema), admin_service_1.default.blockAccount);
adminRouter.patch("/accounts/:accountId/unBlock", (0, validation_1.Validation)(AV.unBlockAccountsSchema), admin_service_1.default.unBlockAccount);
adminRouter.get("/cards", (0, validation_1.Validation)(AV.getAllCardsSchema), admin_service_1.default.getAllCards);
adminRouter.patch("/cards/:cardId/block", (0, validation_1.Validation)(AV.blockCardSchema), admin_service_1.default.blockCard);
adminRouter.get("/transaction", (0, validation_1.Validation)(AV.getAllTransactionSchema), admin_service_1.default.getAllTransaction);
adminRouter.get("/dashBoard", admin_service_1.default.Dashboard);
exports.default = adminRouter;
