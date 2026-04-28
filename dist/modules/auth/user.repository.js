"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_repository_1 = __importDefault(require("../../repositories/base.repository"));
const user_model_1 = __importDefault(require("../../DB/model/user.model"));
class UserRepository extends base_repository_1.default {
    _model;
    constructor(_model = user_model_1.default) {
        super(_model);
        this._model = _model;
    }
    async findOneWithPassword(filter) {
        return this._model.findOne(filter).select('+password');
    }
}
exports.default = UserRepository;
