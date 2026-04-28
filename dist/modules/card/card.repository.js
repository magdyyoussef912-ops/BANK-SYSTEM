"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const creditCard_model_1 = __importDefault(require("../../DB/model/creditCard.model"));
const base_repository_1 = __importDefault(require("../../repositories/base.repository"));
class cardRepository extends base_repository_1.default {
    _model;
    constructor(_model = creditCard_model_1.default) {
        super(_model);
        this._model = _model;
    }
}
exports.default = cardRepository;
