"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_global_handler_1 = require("../../common/utils/error.global.handler");
const success_Responsive_1 = require("../../common/utils/success.Responsive");
const beneficiary_repository_1 = __importDefault(require("./beneficiary.repository"));
const user_repository_1 = __importDefault(require("../auth/user.repository"));
const account_repository_1 = __importDefault(require("../account/account.repository"));
const mongoose_1 = require("mongoose");
class BeneficiaryService {
    _beneficiaryModel = new beneficiary_repository_1.default();
    _userModel = new user_repository_1.default();
    _accountModel = new account_repository_1.default();
    constructor() { }
    createBeneficiary = async (req, res, next) => {
        const { accountNumber, bankName, nickName } = req.body;
        const beneficiaryExists = await this._beneficiaryModel.findOne({
            filter: { accountNumber }
        });
        if (beneficiaryExists) {
            throw new error_global_handler_1.AppError("Beneficiary already exists", 400);
        }
        if (await this._accountModel.findOne({ filter: { accountNumber } })) {
            throw new error_global_handler_1.AppError("Account already exist", 409);
        }
        const user = await this._userModel.findOne({
            filter: { _id: req.user._id }
        });
        if (!user) {
            throw new error_global_handler_1.AppError("User not found", 404);
        }
        const session = await (0, mongoose_1.startSession)();
        try {
            session.startTransaction();
            const beneficiary = await this._beneficiaryModel.create({
                accountNumber,
                bankName,
                nickName,
                ownerUserId: req.user._id
            });
            const account = await this._accountModel.create({
                accountNumber: beneficiary.accountNumber,
                balance: 0,
                userId: beneficiary._id
            });
            await session.commitTransaction();
            (0, success_Responsive_1.successResponse)({ res, message: "Beneficiary created successfully", data: { beneficiary, account } });
        }
        catch (error) {
            await session.abortTransaction();
            throw new error_global_handler_1.AppError(error, 500);
        }
        finally {
            session.endSession();
        }
    };
    getAllBeneficiary = async (req, res, next) => {
        const beneficiary = await this._beneficiaryModel.find({
            filter: { ownerUserId: req.user._id }
        });
        (0, success_Responsive_1.successResponse)({ res, message: "Beneficiary fetched successfully", data: beneficiary });
    };
    deleteBeneficiary = async (req, res, next) => {
        const { id } = req.params;
        const beneficiary = await this._beneficiaryModel.findOneAndDelete({
            filter: { _id: id, ownerUserId: req.user._id }
        });
        if (!beneficiary) {
            throw new error_global_handler_1.AppError("Beneficiary not found", 404);
        }
        (0, success_Responsive_1.successResponse)({ res, message: "Beneficiary deleted successfully", data: beneficiary });
    };
}
exports.default = new BeneficiaryService();
