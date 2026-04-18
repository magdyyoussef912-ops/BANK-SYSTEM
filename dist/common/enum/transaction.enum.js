"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enumTransactionStatus = exports.enumTransactionType = void 0;
var enumTransactionType;
(function (enumTransactionType) {
    enumTransactionType["DEPOSIT"] = "deposit";
    enumTransactionType["WITHDRAWAL"] = "withdrawal";
    enumTransactionType["TRANSFER"] = "transfer";
})(enumTransactionType || (exports.enumTransactionType = enumTransactionType = {}));
var enumTransactionStatus;
(function (enumTransactionStatus) {
    enumTransactionStatus["PENDING"] = "pending";
    enumTransactionStatus["SUCCESS"] = "success";
    enumTransactionStatus["FAILED"] = "failed";
})(enumTransactionStatus || (exports.enumTransactionStatus = enumTransactionStatus = {}));
