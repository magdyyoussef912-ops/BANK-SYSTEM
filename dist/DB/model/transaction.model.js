"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const transaction_enum_1 = require("../../common/enum/transaction.enum");
const transactionSchema = new mongoose_1.default.Schema({
    accountId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "account",
        required: true
    },
    balanceBefore: {
        type: Number,
        default: 0
    },
    balanceAfter: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: transaction_enum_1.enumTransactionStatus,
        default: transaction_enum_1.enumTransactionStatus.PENDING
    },
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: transaction_enum_1.enumTransactionType,
        required: true
    }
}, {
    timestamps: true,
    strict: true,
    strictQuery: true
});
const transactionModel = mongoose_1.default.models.transaction || mongoose_1.default.model("transaction", transactionSchema);
exports.default = transactionModel;
