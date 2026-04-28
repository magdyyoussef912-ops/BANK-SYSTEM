"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const card_repository_1 = __importDefault(require("./card.repository"));
const account_repository_1 = __importDefault(require("../account/account.repository"));
const error_global_handler_1 = require("../../common/utils/error.global.handler");
const account_enum_1 = require("../../common/enum/account.enum");
const hash_security_1 = require("../../common/utils/security/hash.security");
const creditcard_enum_1 = require("../../common/enum/creditcard.enum");
const success_Responsive_1 = require("../../common/utils/success.Responsive");
const mongoose_1 = __importDefault(require("mongoose"));
class cardService {
    _cardModel = new card_repository_1.default();
    _accountModel = new account_repository_1.default();
    constructor() { }
    addCard = async (req, res, next) => {
        const { bankName, cardType, cardNumber, password } = req.body;
        if (cardNumber && await this._cardModel.findOne({ filter: { cardNumber } })) {
            throw new error_global_handler_1.AppError("Card Number already exists", 409);
        }
        const session = await mongoose_1.default.startSession();
        try {
            session.startTransaction();
            const account = await this._accountModel.create({
                userId: req.user._id,
                accountNumber: (0, account_enum_1.GenerateAccountNumber)(),
                balance: 0,
                currency: account_enum_1.enumCurrency.EGP,
                status: account_enum_1.enumStatusAccount.ACTIVE
            });
            const card = await this._cardModel.create({
                accountId: account._id,
                userId: req.user._id,
                bankName,
                cardType,
                cardNumber: cardNumber || (0, creditcard_enum_1.generateCardNumber)(),
                password: await (0, hash_security_1.Hash)({ plainText: password })
            });
            await session.commitTransaction();
            (0, success_Responsive_1.successResponse)({ res, message: "Card created successfully", data: { card, account } });
        }
        catch (error) {
            await session.abortTransaction();
            throw new error_global_handler_1.AppError(error, 500);
        }
        finally {
            await session.endSession();
        }
    };
    deleteCard = async (req, res, next) => {
        const { cardId } = req.params;
        const card = await this._cardModel.findOne({ filter: { _id: cardId } });
        if (!card) {
            throw new error_global_handler_1.AppError("Card Not Found", 404);
        }
        const session = await mongoose_1.default.startSession();
        try {
            session.startTransaction();
            await this._accountModel.deleteOne({ filter: { _id: card.accountId } });
            await this._cardModel.deleteOne({ filter: { _id: cardId } });
            await session.commitTransaction();
            (0, success_Responsive_1.successResponse)({ res, message: "Card deleted successfully" });
        }
        catch (error) {
            await session.abortTransaction();
            throw new error_global_handler_1.AppError(error, 500);
        }
        finally {
            await session.endSession();
        }
    };
    getAllCards = async (req, res, next) => {
        const cards = await this._cardModel.find({
            filter: { userId: req.user._id }
        });
        (0, success_Responsive_1.successResponse)({ res, message: "Your Cards", data: cards });
    };
    setDefaultCard = async (req, res, next) => {
        const { cardId } = req.params;
        const card = await this._cardModel.findOne({ filter: { _id: cardId } });
        if (!card) {
            throw new error_global_handler_1.AppError("Card Not Found", 404);
        }
        const session = await mongoose_1.default.startSession();
        try {
            session.startTransaction();
            await this._accountModel.updateOne({ filter: { _id: card.accountId }, update: { default: true } });
            await this._cardModel.updateOne({ filter: { _id: cardId }, update: { default: true } });
            await session.commitTransaction();
            (0, success_Responsive_1.successResponse)({ res, message: "Card set as default successfully" });
        }
        catch (error) {
            await session.abortTransaction();
            throw new error_global_handler_1.AppError(error, 500);
        }
        finally {
            await session.endSession();
        }
    };
}
exports.default = new cardService();
