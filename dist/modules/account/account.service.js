"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const account_repository_1 = __importDefault(require("../../repositories/account.repository"));
const error_global_handler_1 = require("../../common/utils/error.global.handler");
const success_Responsive_1 = require("../../common/utils/success.Responsive");
class AccountService {
    _accountModel = new account_repository_1.default();
    constructor() { }
    getAccount = async (req, res, next) => {
        const account = await this._accountModel.find({ filter: { userId: req.user?._id } });
        if (!account) {
            throw new error_global_handler_1.AppError("Account Not Found", 404);
        }
        (0, success_Responsive_1.successResponse)({ res, message: "Account Found", data: account });
    };
}
exports.default = new AccountService();
