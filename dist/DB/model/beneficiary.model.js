"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const beneficiarySchema = new mongoose_1.default.Schema({
    accountNumber: {
        type: String,
        required: true,
        ref: "account",
        unique: true
    },
    bankName: String,
    nickName: String,
    ownerUserId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "user",
        required: true
    }
}, {
    strict: true,
    strictQuery: true
});
const beneficiaryModel = mongoose_1.default.models.beneficiary || mongoose_1.default.model("beneficiary", beneficiarySchema);
exports.default = beneficiaryModel;
