"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateAccountNumber = exports.enumCurrency = exports.enumStatusAccount = void 0;
var enumStatusAccount;
(function (enumStatusAccount) {
    enumStatusAccount["ACTIVE"] = "active";
    enumStatusAccount["BLOCKED"] = "blocked";
})(enumStatusAccount || (exports.enumStatusAccount = enumStatusAccount = {}));
var enumCurrency;
(function (enumCurrency) {
    enumCurrency["EGP"] = "EGP";
    enumCurrency["USD"] = "USD";
})(enumCurrency || (exports.enumCurrency = enumCurrency = {}));
const GenerateAccountNumber = () => {
    const prefix = "123";
    const randomNumber = Math.floor(1000000000 + Math.random() * 9000000000);
    return `${prefix}${randomNumber}`;
};
exports.GenerateAccountNumber = GenerateAccountNumber;
