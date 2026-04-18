"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_global_handler_1 = require("../../common/utils/error.global.handler");
const success_Responsive_1 = require("../../common/utils/success.Responsive");
const transaction_repository_1 = __importDefault(require("../../repositories/transaction.repository"));
const account_repository_1 = __importDefault(require("../../repositories/account.repository"));
const transaction_enum_1 = require("../../common/enum/transaction.enum");
const account_enum_1 = require("../../common/enum/account.enum");
class TransactionService {
    _transactionModel = new transaction_repository_1.default();
    _accountModel = new account_repository_1.default();
    constructor() { }
    deposit = async (req, res, next) => {
        const { amount } = req.body;
        const account = await this._accountModel.findOneAndUpdate({
            filter: { userId: req.user?._id, status: account_enum_1.enumStatusAccount.ACTIVE },
            update: { $inc: { balance: amount } },
            options: { new: false }
        });
        if (!account) {
            throw new error_global_handler_1.AppError("Account Not Found, or Account is Blocked", 404);
        }
        const deposit = await this._transactionModel.create({
            userId: req.user?._id,
            accountId: account._id,
            amount,
            balanceBefore: account.balance,
            balanceAfter: account.balance + amount,
            type: transaction_enum_1.enumTransactionType.DEPOSIT,
            status: transaction_enum_1.enumTransactionStatus.SUCCESS
        });
        (0, success_Responsive_1.successResponse)({ res, message: "Deposit Successfully", data: account });
    };
    withdraw = async (req, res, next) => {
        const { amount } = req.body;
        const account = await this._accountModel.findOneAndUpdate({
            filter: { userId: req.user?._id, status: account_enum_1.enumStatusAccount.ACTIVE, balance: { $gte: amount } },
            update: { $inc: { balance: -amount } },
            options: { new: false }
        });
        if (!account) {
            throw new error_global_handler_1.AppError("Account Not Found,balance is less than amount, or Account is Blocked", 404);
        }
        const withdraw = await this._transactionModel.create({
            userId: req.user?._id,
            accountId: account._id,
            amount,
            balanceBefore: account.balance,
            balanceAfter: account.balance - amount,
            type: transaction_enum_1.enumTransactionType.WITHDRAWAL,
            status: transaction_enum_1.enumTransactionStatus.SUCCESS
        });
        (0, success_Responsive_1.successResponse)({ res, message: "Withdraw Successfully", data: account });
    };
    getAllTransactions = async (req, res, next) => {
        const transactions = await this._transactionModel.find({
            filter: { userId: req.user?._id, status: account_enum_1.enumStatusAccount.ACTIVE }
        });
        (0, success_Responsive_1.successResponse)({ res, message: "Transactions Fetched Successfully", data: transactions });
    };
    getSingleTransaction = async (req, res, next) => {
        const { id } = req.params;
        const transaction = await this._transactionModel.findOne({
            filter: { _id: id, status: account_enum_1.enumStatusAccount.ACTIVE }
        });
        if (!transaction) {
            throw new error_global_handler_1.AppError("Transaction Not Found", 404);
        }
        (0, success_Responsive_1.successResponse)({ res, message: "Transaction Fetched Successfully", data: transaction });
    };
}
exports.default = new TransactionService();
