"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const account_repository_1 = __importDefault(require("../account/account.repository"));
const user_repository_1 = __importDefault(require("../auth/user.repository"));
const error_global_handler_1 = require("../../common/utils/error.global.handler");
const success_Responsive_1 = require("../../common/utils/success.Responsive");
const hash_security_1 = require("../../common/utils/security/hash.security");
class UserService {
    _userModel = new user_repository_1.default();
    _accountModel = new account_repository_1.default();
    constructor() { }
    updateInfo = async (req, res, next) => {
        const { fullName } = req.body;
        const user = await this._userModel.findOneAndUpdate({
            filter: { _id: req.user._id },
            update: { fullName },
        });
        if (!user) {
            throw new error_global_handler_1.AppError("User Not Found", 409);
        }
        (0, success_Responsive_1.successResponse)({ res, message: "Your information updated successfully", data: user });
    };
    updatePassword = async (req, res, next) => {
        const { password, nPassword, cPassword } = req.body;
        const user = await this._userModel.findOneWithPassword({
            filter: { _id: req.user._id }
        });
        if (!user) {
            throw new error_global_handler_1.AppError("User Not Found", 409);
        }
        if (!await (0, hash_security_1.Compare)({ plainText: password, cipherText: user.password })) {
            throw new error_global_handler_1.AppError("Invalid password", 401);
        }
        if (nPassword !== cPassword) {
            throw new error_global_handler_1.AppError("Passwords do not match", 401);
        }
        const hashNPassword = await (0, hash_security_1.Hash)({ plainText: nPassword });
        await this._userModel.findOneAndUpdate({
            filter: { _id: user._id },
            update: { password: hashNPassword },
        });
        user.changeCredential = new Date();
        await user.save();
        (0, success_Responsive_1.successResponse)({ res, message: "Your password updated successfully" });
    };
    getUser = async (req, res, next) => {
        const user = await this._userModel.findOne({
            filter: { _id: req.user._id }
        });
        if (!user) {
            throw new error_global_handler_1.AppError("user Not found", 409);
        }
        (0, success_Responsive_1.successResponse)({ res, message: "Your information", data: user });
    };
    getAllAccounts = async (req, res, next) => {
        const accounts = await this._accountModel.find({
            filter: { userId: req.user._id },
            options: {
                populate: [{ path: "cards", select: '-_id -createdAt -updatedAt -__v' }]
            }
        });
        (0, success_Responsive_1.successResponse)({ res, message: "Your accounts", data: { user: req.user, accounts } });
    };
    deleteUser = async (req, res, next) => {
        const [user, accounts] = await Promise.all([
            this._userModel.findOne({
                filter: { _id: req.user._id }
            }),
            this._accountModel.find({
                filter: { userId: req.user._id, balance: { $gt: 0 } }
            })
        ]);
        if (!user) {
            throw new error_global_handler_1.AppError("user Not found", 409);
        }
        if (accounts.length >= 1) {
            throw new error_global_handler_1.AppError("You have accounts with balance, please close them first", 409);
        }
        await Promise.all([
            this._userModel.findOneAndDelete({
                filter: { _id: req.user._id }
            }),
            this._accountModel.deleteMany({
                filter: { userId: req.user._id }
            })
        ]);
        (0, success_Responsive_1.successResponse)({ res, message: "Your account deleted successfully" });
    };
}
exports.default = new UserService();
