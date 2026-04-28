"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Authentication = void 0;
const error_global_handler_1 = require("../utils/error.global.handler");
const config_service_1 = require("../../config/config.service");
const token_service_1 = require("../utils/security/token.service");
const user_repository_1 = __importDefault(require("../../modules/auth/user.repository"));
const redis_service_1 = __importDefault(require("../service/redis.service"));
const userRepository = new user_repository_1.default();
const Authentication = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        throw new error_global_handler_1.AppError("Token Not Found");
    }
    const [prefix, token] = authorization.split(" ");
    if (prefix !== config_service_1.PREFIX) {
        throw new error_global_handler_1.AppError("inValid Prefix");
    }
    const decoded = (0, token_service_1.VerfiyToken)({ token: token, secretOrPublicKey: config_service_1.ACCESS_TOKEN_KEY });
    if (!decoded || typeof decoded !== "object" || !("id" in decoded)) {
        throw new error_global_handler_1.AppError("inValid token payload");
    }
    const user = await userRepository.findOne({ filter: { _id: decoded.id } });
    if (!user) {
        throw new error_global_handler_1.AppError("User Not Found", 409);
    }
    if (user.changeCredential?.getTime() > decoded.iat * 1000) {
        throw new error_global_handler_1.AppError("inValid Token");
    }
    const revoked_token_value = await redis_service_1.default.get(redis_service_1.default.revoked_token({ userId: decoded.id, jti: decoded.jti }));
    if (revoked_token_value) {
        throw new error_global_handler_1.AppError("inValid Token revoked");
    }
    req.user = user;
    req.decoded = decoded;
    next();
};
exports.Authentication = Authentication;
