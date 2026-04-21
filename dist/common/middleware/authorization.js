"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Authorization = void 0;
const error_global_handler_1 = require("../utils/error.global.handler");
const Authorization = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new error_global_handler_1.AppError("Unauthorized", 403);
        }
        next();
    };
};
exports.Authorization = Authorization;
