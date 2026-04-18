"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bootstrap = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const error_global_handler_1 = require("./common/utils/error.global.handler");
const success_Responsive_1 = require("./common/utils/success.Responsive");
const config_service_1 = require("./config/config.service");
const connectionDB_1 = require("./DB/connectionDB");
const auth_controller_1 = __importDefault(require("./modules/user/auth.controller"));
const account_controller_1 = __importDefault(require("./modules/account/account.controller"));
const transaction_controller_1 = __importDefault(require("./modules/transaction/transaction.controller"));
const app = (0, express_1.default)();
const port = config_service_1.PORT;
const bootstrap = () => {
    const limiter = (0, express_rate_limit_1.default)({
        windowMs: 15 * 60 * 1000,
        max: 100,
        message: "Too many requests, please try again later",
        handler: (req, res) => {
            throw new error_global_handler_1.AppError(`Too many requests, please try again later`, 429);
        },
        standardHeaders: true,
        legacyHeaders: false,
    });
    app.use(express_1.default.json(), (0, cors_1.default)(), (0, helmet_1.default)(), limiter);
    (0, connectionDB_1.checkConnectionDB)();
    app.get("/", (req, res, next) => {
        (0, success_Responsive_1.successResponse)({ res, message: "Welcome to the Bank System..." });
    });
    app.use("/auth", auth_controller_1.default);
    app.use("/account", account_controller_1.default);
    app.use("/transaction", transaction_controller_1.default);
    app.use("{/*demo}", (req, res, next) => {
        throw new error_global_handler_1.AppError(`404 ${req.method} ${req.url} Not Found...`, 404);
    });
    app.use(error_global_handler_1.globalErrorHandler);
    app.listen(port, () => {
        console.log(`server is running at port ${port} .......`);
    });
};
exports.bootstrap = bootstrap;
