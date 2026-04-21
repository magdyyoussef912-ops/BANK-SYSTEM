"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const account_repository_1 = __importDefault(require("../../repositories/account.repository"));
const error_global_handler_1 = require("../../common/utils/error.global.handler");
const success_Responsive_1 = require("../../common/utils/success.Responsive");
const transaction_repository_1 = __importDefault(require("../../repositories/transaction.repository"));
const transaction_enum_1 = require("../../common/enum/transaction.enum");
class AccountService {
    _accountModel = new account_repository_1.default();
    _transactionModel = new transaction_repository_1.default();
    constructor() { }
    getAccount = async (req, res, next) => {
        const account = await this._accountModel.find({ filter: { userId: req.user?._id } });
        if (!account) {
            throw new error_global_handler_1.AppError("Account Not Found", 404);
        }
        (0, success_Responsive_1.successResponse)({ res, message: "Account Found", data: account });
    };
    status = async (req, res, next) => {
        const { from, to } = req.query;
        const account = await this._accountModel.findOne({ filter: { userId: req.user?._id } });
        if (!account) {
            throw new error_global_handler_1.AppError("Account Not Found", 404);
        }
        const transaction = await this._transactionModel.find({
            filter: {
                accountNumber: account._id,
                createdAt: {
                    $gte: new Date(from),
                    $lte: new Date(to)
                }
            }
        });
        const totalDeposit = transaction
            .filter(t => t.type === transaction_enum_1.enumTransactionType.DEPOSIT)
            .reduce((sum, t) => sum + t.amount, 0);
        const totalWithdraw = transaction
            .filter(t => t.type === transaction_enum_1.enumTransactionType.WITHDRAWAL)
            .reduce((sum, t) => sum + t.amount, 0);
        const totalTransfer = transaction
            .filter(t => t.type === transaction_enum_1.enumTransactionType.TRANSFER)
            .reduce((sum, t) => sum + t.amount, 0);
        (0, success_Responsive_1.successResponse)({ res, message: "Account Status", data: { transaction, totalDeposit, totalWithdraw, totalTransfer } });
    };
}
exports.default = new AccountService();
