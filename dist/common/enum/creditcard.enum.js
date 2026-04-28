"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCardNumber = exports.cardStatus = exports.cardType = void 0;
var cardType;
(function (cardType) {
    cardType["visa"] = "visa";
    cardType["mastercard"] = "mastercard";
})(cardType || (exports.cardType = cardType = {}));
var cardStatus;
(function (cardStatus) {
    cardStatus["active"] = "active";
    cardStatus["blocked"] = "blocked";
})(cardStatus || (exports.cardStatus = cardStatus = {}));
const generateCardNumber = () => {
    const prefix = "4";
    const random = Math.floor(Math.random() * 1e15).toString().padStart(15, "0");
    return `${prefix}${random}`.slice(0, 16);
};
exports.generateCardNumber = generateCardNumber;
