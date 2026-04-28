"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_global_handler_1 = require("../../common/utils/error.global.handler");
const hash_security_1 = require("../../common/utils/security/hash.security");
const success_Responsive_1 = require("../../common/utils/success.Responsive");
const node_crypto_1 = require("node:crypto");
const token_service_1 = require("../../common/utils/security/token.service");
const config_service_1 = require("../../config/config.service");
const account_repository_1 = __importDefault(require("../account/account.repository"));
const user_repository_1 = __importDefault(require("./user.repository"));
const redis_service_1 = __importDefault(require("../../common/service/redis.service"));
class AuthService {
    _userModel = new user_repository_1.default();
    _accountModel = new account_repository_1.default();
    _redisService = redis_service_1.default;
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
        (0, success_Responsive_1.successResponse)({ res, message: "User created successfully", data: { user } });
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
                expiresIn: "1d",
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
    logOut = async (req, res, next) => {
        const { flag } = req.query;
        if (flag == "All") {
            req.user.changeCredential = new Date();
            await req.user.save();
            const revoked_tokens = await this._redisService.keys(this._redisService.revoked_id_token({ userId: req.decoded.id }));
            if (revoked_tokens && revoked_tokens.length > 0) {
                await Promise.all(revoked_tokens.map(key => this._redisService.del(key)));
            }
        }
        else {
            await this._redisService.setValue({
                key: this._redisService.revoked_token({
                    userId: req.decoded.id,
                    jti: req.decoded.jti,
                }),
                value: `${req.decoded.id}`,
                ttl: req.decoded.exp - Math.floor(Date.now() / 1000)
            });
        }
        await req.user.save();
        (0, success_Responsive_1.successResponse)({ res, message: "User logged out successfully" });
    };
}
exports.default = new AuthService();
