"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const account_enum_1 = require("../../common/enum/account.enum");
const accountSchema = new mongoose_1.default.Schema({
    accountNumber: {
        type: String,
        required: true,
        unique: true
    },
    balance: {
        type: Number,
        default: 0
    },
    currency: {
        type: String,
        enum: account_enum_1.enumCurrency,
        default: account_enum_1.enumCurrency.EGP
    },
    status: {
        type: String,
        enum: account_enum_1.enumStatusAccount,
        default: account_enum_1.enumStatusAccount.ACTIVE
    },
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "user",
        required: true
    }
}, {
    timestamps: true,
    strict: true,
    strictQuery: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
const accountModel = mongoose_1.default.models.account || mongoose_1.default.model("account", accountSchema);
exports.default = accountModel;
