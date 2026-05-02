"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkConnectionDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const config_service_1 = require("../config/config.service");
const checkConnectionDB = async () => {
    try {
        await mongoose_1.default.connect(config_service_1.DB_URI_ONLINE);
        console.log(`Database ${config_service_1.DB_URI_ONLINE} connected successfully......`);
    }
    catch (error) {
        console.log(error);
    }
};
exports.checkConnectionDB = checkConnectionDB;
