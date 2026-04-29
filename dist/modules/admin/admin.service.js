"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_repository_1 = __importDefault(require("../auth/user.repository"));
const success_Responsive_1 = require("../../common/utils/success.Responsive");
const mongoose_1 = require("mongoose");
const error_global_handler_1 = require("../../common/utils/error.global.handler");
const user_enum_1 = require("../../common/enum/user.enum");
const account_repository_1 = __importDefault(require("../account/account.repository"));
const account_enum_1 = require("../../common/enum/account.enum");
const card_repository_1 = __importDefault(require("../card/card.repository"));
const transaction_repository_1 = __importDefault(require("../transaction/transaction.repository"));
const creditcard_enum_1 = require("../../common/enum/creditcard.enum");
class adminService {
    _userModel = new user_repository_1.default();
    _accountModel = new account_repository_1.default();
    _cardModel = new card_repository_1.default();
    _transactionModel = new transaction_repository_1.default();
    constructor() { }
    getAllUsers = async (req, res, next) => {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const users = await this._userModel.find({
            filter: { role: user_enum_1.RoleEnum.USER },
            options: { limit, skip }
        });
        (0, success_Responsive_1.successResponse)({ res, message: "All Users", data: users });
    };
    getUser = async (req, res, next) => {
        const { userId } = req.params;
        const user = await this._userModel.findById(new mongoose_1.Types.ObjectId(userId));
        if (!user) {
            throw new error_global_handler_1.AppError("user Not Found", 409);
        }
        (0, success_Responsive_1.successResponse)({ res, message: "Successfully", data: user });
    };
    blockUser = async (req, res, next) => {
        const { userId } = req.params;
        const user = await this._userModel.findOneAndUpdate({
            filter: { _id: userId },
            update: { status: user_enum_1.StatusEnumUser.Block }
        });
        if (!user) {
            throw new error_global_handler_1.AppError("user Not Found", 409);
        }
        (0, success_Responsive_1.successResponse)({ res, message: "user Blocked Successfully" });
    };
    UnblockUser = async (req, res, next) => {
        const { userId } = req.params;
        const user = await this._userModel.findOneAndUpdate({
            filter: { _id: userId, status: user_enum_1.StatusEnumUser.Block },
            update: { status: user_enum_1.StatusEnumUser.Active }
        });
        if (!user) {
            throw new error_global_handler_1.AppError("user Not Found", 409);
        }
        (0, success_Responsive_1.successResponse)({ res, message: "user Actived Successfully" });
    };
    deleteUser = async (req, res, next) => {
        const { userId } = req.params;
        const user = await this._userModel.findOneAndDelete({
            filter: { _id: userId }
        });
        if (!user) {
            throw new error_global_handler_1.AppError("user Not Found", 409);
        }
        (0, success_Responsive_1.successResponse)({ res, message: "user Deleted Successfully" });
    };
    getAllAccounts = async (req, res, next) => {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const Accounts = await this._accountModel.find({
            filter: {},
            options: { limit, skip }
        });
        (0, success_Responsive_1.successResponse)({ res, message: "All Accounts", data: Accounts });
    };
    blockAccount = async (req, res, next) => {
        const { accountId } = req.params;
        const account = await this._accountModel.findOneAndUpdate({
            filter: { _id: accountId },
            update: { status: account_enum_1.enumStatusAccount.BLOCKED }
        });
        if (!account) {
            throw new error_global_handler_1.AppError("account Not Found", 409);
        }
        (0, success_Responsive_1.successResponse)({ res, message: "account Blocked Successfully" });
    };
    unBlockAccount = async (req, res, next) => {
        const { accountId } = req.params;
        const account = await this._accountModel.findOneAndUpdate({
            filter: { _id: accountId, status: account_enum_1.enumStatusAccount.BLOCKED },
            update: { status: account_enum_1.enumStatusAccount.ACTIVE }
        });
        if (!account) {
            throw new error_global_handler_1.AppError("account Not Found", 409);
        }
        (0, success_Responsive_1.successResponse)({ res, message: "account ACTIVEd Successfully" });
    };
    getAllCards = async (req, res, next) => {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const Cards = await this._cardModel.find({
            filter: {},
            options: { limit, skip }
        });
        (0, success_Responsive_1.successResponse)({ res, message: "All Cards", data: Cards });
    };
    blockCard = async (req, res, next) => {
        const { cardId } = req.params;
        const Card = await this._cardModel.findOneAndUpdate({
            filter: { _id: cardId },
            update: { status: creditcard_enum_1.cardStatus.blocked }
        });
        if (!Card) {
            throw new error_global_handler_1.AppError("Card Not Found", 409);
        }
        (0, success_Responsive_1.successResponse)({ res, message: "Card Blocked Successfully" });
    };
    getAllTransaction = async (req, res, next) => {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const Transactions = await this._transactionModel.find({
            filter: {},
            options: { limit, skip }
        });
        (0, success_Responsive_1.successResponse)({ res, message: "All Transactions", data: Transactions });
    };
    Dashboard = async (req, res, next) => {
        const [user, account, card, transaction] = await Promise.all([
            this._userModel.find({ filter: {} }),
            this._accountModel.find({ filter: {} }),
            this._cardModel.find({ filter: {} }),
            this._transactionModel.find({ filter: {} })
        ]);
        (0, success_Responsive_1.successResponse)({ res,
            message: "Your Dashboard",
            data: {
                TotalUsers: user.length,
                TotalAccounts: account.length,
                TotalCards: card.length,
                TotalTransactions: transaction.length
            }
        });
    };
}
exports.default = new adminService();
