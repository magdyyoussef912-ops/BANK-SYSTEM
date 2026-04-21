"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_global_handler_1 = require("../../common/utils/error.global.handler");
const success_Responsive_1 = require("../../common/utils/success.Responsive");
const beneficiary_repository_1 = __importDefault(require("./beneficiary.repository"));
const user_repository_1 = __importDefault(require("../user/user.repository"));
class BeneficiaryService {
    _beneficiaryModel = new beneficiary_repository_1.default();
    _userModel = new user_repository_1.default();
    constructor() { }
    createBeneficiary = async (req, res, next) => {
        const { accountNumber, bankName, nickName } = req.body;
        const beneficiaryExists = await this._beneficiaryModel.findOne({
            filter: { accountNumber }
        });
        if (beneficiaryExists) {
            throw new error_global_handler_1.AppError("Beneficiary already exists", 400);
        }
        const user = await this._userModel.findOne({
            filter: { _id: req.user._id }
        });
        if (!user) {
            throw new error_global_handler_1.AppError("User not found", 404);
        }
        const beneficiary = await this._beneficiaryModel.create({
            accountNumber,
            bankName,
            nickName,
            ownerUserId: req.user._id
        });
        (0, success_Responsive_1.successResponse)({ res, message: "Beneficiary created successfully", data: beneficiary });
    };
}
exports.default = new BeneficiaryService();
