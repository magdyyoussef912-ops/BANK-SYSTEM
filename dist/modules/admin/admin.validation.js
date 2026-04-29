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
exports.getAllTransactionSchema = exports.blockCardSchema = exports.getAllCardsSchema = exports.blockAccountsSchema = exports.unBlockAccountsSchema = exports.getAllAccountsSchema = exports.deleteUserSchema = exports.unBlockUserSchema = exports.blockUserSchema = exports.getUserSchema = exports.getAllUsersSchema = void 0;
const mongoose_1 = require("mongoose");
const z = __importStar(require("zod"));
exports.getAllUsersSchema = {
    query: z.object({
        limit: z.string().optional(),
        page: z.string().optional(),
    })
};
exports.getUserSchema = {
    params: z.object({
        userId: z.string().refine((val) => mongoose_1.Types.ObjectId.isValid(val), { message: "Invalid user ID" }),
    })
};
exports.blockUserSchema = {
    params: z.object({
        userId: z.string().refine((val) => mongoose_1.Types.ObjectId.isValid(val), { message: "Invalid user ID" }),
    })
};
exports.unBlockUserSchema = {
    params: z.object({
        userId: z.string().refine((val) => mongoose_1.Types.ObjectId.isValid(val), { message: "Invalid user ID" }),
    })
};
exports.deleteUserSchema = {
    params: z.object({
        userId: z.string().refine((val) => mongoose_1.Types.ObjectId.isValid(val), { message: "Invalid user ID" }),
    })
};
exports.getAllAccountsSchema = {
    query: z.object({
        limit: z.string(),
        page: z.string(),
    })
};
exports.unBlockAccountsSchema = {
    params: z.object({
        accountId: z.string().refine((val) => mongoose_1.Types.ObjectId.isValid(val), { message: "Invalid user ID" }),
    })
};
exports.blockAccountsSchema = {
    params: z.object({
        accountId: z.string().refine((val) => mongoose_1.Types.ObjectId.isValid(val), { message: "Invalid user ID" }),
    })
};
exports.getAllCardsSchema = {
    query: z.object({
        limit: z.string(),
        page: z.string(),
    })
};
exports.blockCardSchema = {
    params: z.object({
        cardId: z.string().refine((val) => mongoose_1.Types.ObjectId.isValid(val), { message: "Invalid user ID" }),
    })
};
exports.getAllTransactionSchema = {
    query: z.object({
        limit: z.string(),
        page: z.string(),
    })
};
