"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validation_1 = require("../../common/middleware/validation");
const UV = __importStar(require("./auth.validation"));
const auth_service_1 = require("./auth.service");
const authentication_1 = require("../../common/middleware/authentication");
const authService = new auth_service_1.AuthService();
const userService = new auth_service_1.UserService();
const authRouter = (0, express_1.Router)({ strict: true });
authRouter.post("/register", (0, validation_1.Validation)(UV.signupSchema), authService.signUP);
authRouter.post("/login", (0, validation_1.Validation)(UV.signinSchema), authService.signIN);
authRouter.post("/refresh-token", authService.refreshToken);
authRouter.patch("/update-info", authentication_1.Authentication, (0, validation_1.Validation)(UV.updateInfoSchema), userService.updateInfo);
authRouter.patch("/update-password", authentication_1.Authentication, (0, validation_1.Validation)(UV.updatePasswordSchema), userService.updatePassword);
exports.default = authRouter;
