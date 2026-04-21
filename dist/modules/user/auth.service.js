"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_repository_1 = __importDefault(require("../../repositories/user.repository"));
const error_global_handler_1 = require("../../common/utils/error.global.handler");
const hash_security_1 = require("../../common/utils/security/hash.security");
const success_Responsive_1 = require("../../common/utils/success.Responsive");
const node_crypto_1 = require("node:crypto");
const token_service_1 = require("../../common/utils/token.service");
const config_service_1 = require("../../config/config.service");
const account_enum_1 = require("../../common/enum/account.enum");
const account_repository_1 = __importDefault(require("../../repositories/account.repository"));
class AuthService {
    _userModel = new user_repository_1.default();
    _accountModel = new account_repository_1.default();
    constructor() { }
    signUP = async (req, res, next) => {
        const { fullName, email, password, accountNumber } = req.body;
        if (await this._userModel.findOne({ filter: { email } })) {
            throw new error_global_handler_1.AppError("User already exists", 409);
        }
        const user = await this._userModel.create({
            fullName,
            email,
            password: await (0, hash_security_1.Hash)({ plainText: password })
        });
        if (accountNumber) {
            if (await this._accountModel.findOne({ filter: { accountNumber } })) {
                throw new error_global_handler_1.AppError("Account Number already exists", 409);
            }
        }
        const account = await this._accountModel.create({
            userId: user._id,
            accountNumber: accountNumber || (0, account_enum_1.GenerateAccountNumber)(),
            balance: 0,
            currency: account_enum_1.enumCurrency.EGP,
            status: account_enum_1.enumStatusAccount.ACTIVE
        });
        (0, success_Responsive_1.successResponse)({ res, message: "User created successfully", data: { user, account } });
    };
    signIN = async (req, res, next) => {
        const { email, password } = req.body;
        const user = await this._userModel.findOne({ filter: { email } });
        if (!user) {
            throw new error_global_handler_1.AppError("User not found", 404);
        }
        if (!await (0, hash_security_1.Compare)({ plainText: password, cipherText: user.password })) {
            throw new error_global_handler_1.AppError("Invalid password", 401);
        }
        const jwtid = (0, node_crypto_1.randomUUID)();
        const access_token = (0, token_service_1.GenerateToken)({
            payload: {
                id: user._id,
                email: user.email
            },
            secretOrPrivateKey: config_service_1.ACCESS_TOKEN_KEY,
            options: {
                expiresIn: "1day",
                jwtid
            }
        });
        const refresh_token = (0, token_service_1.GenerateToken)({
            payload: {
                id: user._id,
                email: user.email
            },
            secretOrPrivateKey: config_service_1.REFRESH_TOKEN_KEY,
            options: {
                expiresIn: "1day",
                jwtid
            }
        });
        (0, success_Responsive_1.successResponse)({ res, message: "User logged in successfully", data: { access_token, refresh_token } });
    };
}
exports.default = new AuthService();
