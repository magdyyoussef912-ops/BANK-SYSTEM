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
const beneficiary_repository_1 = __importDefault(require("../../repositories/beneficiary.repository"));
const user_repository_1 = __importDefault(require("../../repositories/user.repository"));
class TransactionService {
    _transactionModel = new transaction_repository_1.default();
    _accountModel = new account_repository_1.default();
    _userModel = new user_repository_1.default();
    _beneficiaryModel = new beneficiary_repository_1.default();
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
    transfer = async (req, res, next) => {
        const { beneficiaryId, amount } = req.body;
        const senderAccount = await this._accountModel.findOne({
            filter: { userId: req.user._id }
        });
        if (!senderAccount) {
            throw new error_global_handler_1.AppError("Account Not Found", 404);
        }
        const beneficiary = await this._beneficiaryModel.findOne({
            filter: { _id: beneficiaryId }
        });
        if (!beneficiary) {
            throw new error_global_handler_1.AppError("Beneficiary Not Found", 404);
        }
        const receiverAccount = await this._accountModel.findOne({
            filter: { accountNumber: beneficiary.accountNumber }
        });
        if (!receiverAccount) {
            throw new error_global_handler_1.AppError("Receiver Account Not Found", 404);
        }
        if (senderAccount.balance < amount) {
            throw new error_global_handler_1.AppError("Insufficient Balance", 400);
        }
        await Promise.all([
            this._accountModel.findOneAndUpdate({
                filter: { userId: req.user?._id },
                update: { $inc: { balance: -amount } },
                options: { new: false }
            }),
            this._accountModel.findOneAndUpdate({
                filter: { _id: receiverAccount._id },
                update: { $inc: { balance: amount } },
                options: { new: false }
            })
        ]);
        const transfer = await this._transactionModel.create({
            userId: req.user?._id,
            accountId: senderAccount._id,
            amount,
            balanceBefore: senderAccount.balance,
            balanceAfter: senderAccount.balance - amount,
            type: transaction_enum_1.enumTransactionType.TRANSFER,
            status: transaction_enum_1.enumTransactionStatus.SUCCESS
        });
        (0, success_Responsive_1.successResponse)({ res, message: "Transfer Successfully", data: transfer });
    };
    summary = async (req, res, next) => {
        const summary = await this._transactionModel.aggregate([
            {
                $match: {
                    userId: req.user?._id
                }
            },
            {
                $group: {
                    _id: "$type",
                    count: { $sum: 1 },
                    totalAmount: { $sum: "$amount" }
                }
            }
        ]);
        (0, success_Responsive_1.successResponse)({ res, message: "Summary Fetched Successfully", data: summary });
    };
}
exports.default = new TransactionService();
