"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const account_service_1 = __importDefault(require("./account.service"));
const authentication_1 = require("../../common/middleware/authentication");
const accountRouter = (0, express_1.Router)();
accountRouter.get("/me", authentication_1.Authentication, account_service_1.default.getAccount);
exports.default = accountRouter;
