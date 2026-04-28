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
exports.setDefaultCardSchema = exports.delCardSchema = exports.addCaredSchema = void 0;
const z = __importStar(require("zod"));
const creditcard_enum_1 = require("../../common/enum/creditcard.enum");
const mongoose_1 = require("mongoose");
exports.addCaredSchema = {
    body: z.object({
        bankName: z.string().min(3, "Bank Name Must Be 3 Character"),
        cardType: z.enum(creditcard_enum_1.cardType).default(creditcard_enum_1.cardType.visa),
        password: z.string().min(4, "Password Must Be 4 Character").max(4, "Password Must Be 4 Character").trim(),
        cardNumber: z.string().length(16, "Card Number Must Be 16 Character").optional(),
    })
};
exports.delCardSchema = {
    params: z.object({
        cardId: z.string().refine((val) => mongoose_1.Types.ObjectId.isValid(val), { message: "Invalid Card ID" }),
    })
};
exports.setDefaultCardSchema = {
    params: z.object({
        cardId: z.string().refine((val) => mongoose_1.Types.ObjectId.isValid(val), { message: "Invalid Card ID" }),
    })
};
