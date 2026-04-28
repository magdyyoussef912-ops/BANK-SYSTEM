"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = exports.AuthService = void 0;
const error_global_handler_1 = require("../../common/utils/error.global.handler");
const hash_security_1 = require("../../common/utils/security/hash.security");
const success_Responsive_1 = require("../../common/utils/success.Responsive");
const node_crypto_1 = require("node:crypto");
const token_service_1 = require("../../common/utils/security/token.service");
const config_service_1 = require("../../config/config.service");
const account_enum_1 = require("../../common/enum/account.enum");
const account_repository_1 = __importDefault(require("../account/account.repository"));
const user_repository_1 = __importDefault(require("./user.repository"));
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
        const user = await this._userModel.findOneWithPassword({ filter: { email } });
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
                expiresIn: "15m",
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
                expiresIn: "1d",
                jwtid
            }
        });
        (0, success_Responsive_1.successResponse)({ res, message: "User logged in successfully", data: { access_token, refresh_token } });
    };
    refreshToken = async (req, res, next) => {
        const { authorization } = req.headers;
        if (!authorization) {
            throw new error_global_handler_1.AppError("Token Not Found", 404);
        }
        const [prefix, token] = authorization.split(" ");
        if (prefix !== config_service_1.PREFIX) {
            throw new error_global_handler_1.AppError("inValid Prefix", 401);
        }
        const decoded = (0, token_service_1.VerfiyToken)({ token: token, secretOrPublicKey: config_service_1.REFRESH_TOKEN_KEY });
        if (!decoded || typeof decoded !== "object" || !("id" in decoded)) {
            throw new error_global_handler_1.AppError("inValid token payload", 401);
        }
        const user = await this._userModel.findOne({ filter: { _id: decoded.id } });
        if (!user) {
            throw new error_global_handler_1.AppError("User Not Found", 409);
        }
        const jwtid = (0, node_crypto_1.randomUUID)();
        const access_token = (0, token_service_1.GenerateToken)({
            payload: {
                id: user._id,
                email: user.email
            },
            secretOrPrivateKey: config_service_1.ACCESS_TOKEN_KEY,
            options: {
                expiresIn: "15m",
                jwtid
            }
        });
        (0, success_Responsive_1.successResponse)({ res, message: "Token refreshed successfully", data: { access_token } });
    };
}
exports.AuthService = AuthService;
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
        (0, success_Responsive_1.successResponse)({ res, message: "Your password updated successfully" });
    };
}
exports.UserService = UserService;
