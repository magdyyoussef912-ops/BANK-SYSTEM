"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const creditcard_enum_1 = require("../../common/enum/creditcard.enum");
const CreditCardSchema = new mongoose_1.default.Schema({
    accountId: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'Account'
    },
    userId: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'User'
    },
    bankName: {
        type: String,
        required: true
    },
    cardType: {
        type: String,
        enum: creditcard_enum_1.cardType,
        required: true,
        default: creditcard_enum_1.cardType.visa
    },
    status: {
        type: String,
        enum: creditcard_enum_1.cardStatus,
        required: true,
        default: creditcard_enum_1.cardStatus.active
    },
    cardNumber: {
        type: String,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        select: false,
        min: 4,
        max: 4,
    },
    default: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});
const CreditCard = mongoose_1.default.models.CreditCard || mongoose_1.default.model('CreditCard', CreditCardSchema);
exports.default = CreditCard;
