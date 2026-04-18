"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_repository_1 = __importDefault(require("./base.repository"));
const transaction_model_1 = __importDefault(require("../DB/model/transaction.model"));
class TransactionRepository extends base_repository_1.default {
    _model;
    constructor(_model = transaction_model_1.default) {
        super(_model);
        this._model = _model;
    }
}
exports.default = TransactionRepository;
