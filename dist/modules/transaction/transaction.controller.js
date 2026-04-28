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
const transaction_service_1 = __importDefault(require("./transaction.service"));
const validation_1 = require("../../common/middleware/validation");
const TV = __importStar(require("./transaction.validation"));
const authentication_1 = require("../../common/middleware/authentication");
const transactionRouter = (0, express_1.Router)();
transactionRouter.patch("/deposit", authentication_1.Authentication, (0, validation_1.Validation)(TV.depositSchema), transaction_service_1.default.deposit);
transactionRouter.patch("/withdraw", authentication_1.Authentication, (0, validation_1.Validation)(TV.withdrawSchema), transaction_service_1.default.withdraw);
transactionRouter.post("/transfer", authentication_1.Authentication, (0, validation_1.Validation)(TV.transferSchema), transaction_service_1.default.transfer);
transactionRouter.get("/my", authentication_1.Authentication, transaction_service_1.default.getAllTransactions);
transactionRouter.get("/my/summary", authentication_1.Authentication, transaction_service_1.default.summary);
transactionRouter.get("/:id", authentication_1.Authentication, (0, validation_1.Validation)(TV.singleTransactionSchema), transaction_service_1.default.getSingleTransaction);
exports.default = transactionRouter;
