"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_global_handler_1 = require("../../common/utils/error.global.handler");
const success_Responsive_1 = require("../../common/utils/success.Responsive");
const transaction_enum_1 = require("../../common/enum/transaction.enum");
const account_repository_1 = __importDefault(require("./account.repository"));
const transaction_repository_1 = __importDefault(require("../transaction/transaction.repository"));
const account_enum_1 = require("../../common/enum/account.enum");
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
        const from = new Date(req.query.from);
        const to = new Date(req.query.to);
        const account = await this._accountModel.findOne({ filter: { userId: req.user?._id } });
        if (!account) {
            throw new error_global_handler_1.AppError("Account Not Found", 404);
        }
        const transaction = await this._transactionModel.find({
            filter: {
                accountId: account._id,
                createdAt: {
                    $gte: new Date(from.setHours(0, 0, 0, 0)),
                    $lte: new Date(to.setHours(23, 59, 59, 999))
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
    create = async (req, res, next) => {
        if (await this._accountModel.findOne({ filter: { userId: req.user?._id } })) {
            throw new error_global_handler_1.AppError("Account Already Exist", 409);
        }
        const account = await this._accountModel.create({
            userId: req.user?._id,
            accountNumber: (0, account_enum_1.GenerateAccountNumber)(),
            balance: 0,
        });
        (0, success_Responsive_1.successResponse)({ res, message: "Account Created", data: account });
    };
}
exports.default = new AccountService();
