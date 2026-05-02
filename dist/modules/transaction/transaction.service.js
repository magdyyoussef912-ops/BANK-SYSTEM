"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_global_handler_1 = require("../../common/utils/error.global.handler");
const success_Responsive_1 = require("../../common/utils/success.Responsive");
const transaction_enum_1 = require("../../common/enum/transaction.enum");
const account_enum_1 = require("../../common/enum/account.enum");
const beneficiary_repository_1 = __importDefault(require("../beneficiary/beneficiary.repository"));
const account_repository_1 = __importDefault(require("../account/account.repository"));
const transaction_repository_1 = __importDefault(require("./transaction.repository"));
const user_repository_1 = __importDefault(require("../auth/user.repository"));
const mongoose_1 = require("mongoose");
const card_repository_1 = __importDefault(require("../card/card.repository"));
class TransactionService {
    _transactionModel = new transaction_repository_1.default();
    _accountModel = new account_repository_1.default();
    _userModel = new user_repository_1.default();
    _cardModel = new card_repository_1.default();
    _beneficiaryModel = new beneficiary_repository_1.default();
    getAccountByCardOrDefault = async (userId, cardId) => {
        if (cardId) {
            const card = await this._cardModel.findOne({
                filter: { userId, _id: cardId }
            });
            if (!card) {
                throw new error_global_handler_1.AppError("Card Not Found", 404);
            }
            const account = await this._accountModel.findOne({
                filter: { userId, _id: card.accountId }
            });
            if (!account) {
                throw new error_global_handler_1.AppError("Account Not Found", 404);
            }
            return account;
        }
        const account = await this._accountModel.findOne({
            filter: { userId, default: true, status: account_enum_1.enumStatusAccount.ACTIVE },
        });
        if (!account) {
            throw new error_global_handler_1.AppError("Account Not Found, or Account is Blocked", 404);
        }
        return account;
    };
    constructor() { }
    deposit = async (req, res, next) => {
        const { amount, cardId } = req.body;
        const account = await this.getAccountByCardOrDefault(req.user?._id, cardId);
        const deposit = await this._transactionModel.create({
            userId: req.user?._id,
            accountId: account._id,
            amount,
            balanceBefore: account.balance,
            balanceAfter: account.balance + amount,
            type: transaction_enum_1.enumTransactionType.DEPOSIT,
            status: transaction_enum_1.enumTransactionStatus.SUCCESS
        });
        account.balance += amount;
        account.updatedAt = new Date();
        await account.save();
        (0, success_Responsive_1.successResponse)({ res, message: "Deposit Successfully", data: account });
    };
    withdraw = async (req, res, next) => {
        const { amount, cardId } = req.body;
        const account = await this.getAccountByCardOrDefault(req.user?._id, cardId);
        if (account.balance < amount) {
            throw new error_global_handler_1.AppError("Insufficient Balance", 400);
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
        account.balance -= amount;
        account.updatedAt = new Date();
        await account.save();
        (0, success_Responsive_1.successResponse)({ res, message: "Withdraw Successfully", data: account });
    };
    transfer = async (req, res, next) => {
        const { beneficiaryId, amount, cardId } = req.body;
        const senderAccount = await this.getAccountByCardOrDefault(req.user?._id, cardId);
        const beneficiary = await this._beneficiaryModel.findOne({
            filter: { _id: beneficiaryId, ownerUserId: req.user?._id }
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
        const session = await (0, mongoose_1.startSession)();
        try {
            session.startTransaction();
            await Promise.all([
                this._accountModel.findOneAndUpdate({
                    filter: { userId: req.user?._id },
                    update: { $inc: { balance: -amount } }
                }),
                this._accountModel.findOneAndUpdate({
                    filter: { _id: receiverAccount._id },
                    update: { $inc: { balance: amount } }
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
            await session.commitTransaction();
            (0, success_Responsive_1.successResponse)({ res, message: "Transfer Successfully", data: transfer });
        }
        catch (error) {
            await session.abortTransaction();
            throw new error_global_handler_1.AppError(error, 500);
        }
        finally {
            session.endSession();
        }
    };
    getAllTransactions = async (req, res, next) => {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const transactions = await this._transactionModel.find({
            filter: { userId: req.user?._id },
            options: { skip, limit }
        });
        (0, success_Responsive_1.successResponse)({ res, message: "Transactions Fetched Successfully", data: transactions });
    };
    getSingleTransaction = async (req, res, next) => {
        const { id } = req.params;
        const transaction = await this._transactionModel.findOne({
            filter: { _id: id, userId: req.user?._id }
        });
        if (!transaction) {
            throw new error_global_handler_1.AppError("Transaction Not Found", 404);
        }
        (0, success_Responsive_1.successResponse)({ res, message: "Transaction Fetched Successfully", data: transaction });
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
