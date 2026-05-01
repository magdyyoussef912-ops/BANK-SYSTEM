"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WHITE_LIST = exports.REDIS_URL = exports.REFRESH_TOKEN_KEY = exports.PREFIX = exports.ACCESS_TOKEN_KEY = exports.SALT_ROUNDS = exports.LOCAL_URI_DB = exports.PORT = void 0;
const dotenv_1 = require("dotenv");
const node_path_1 = require("node:path");
const NODE_ENV = process.env.NODE_ENV;
(0, dotenv_1.config)({
    path: ((0, node_path_1.resolve)(process.cwd(), `.env.${NODE_ENV}`))
});
exports.PORT = Number(process.env.PORT);
exports.LOCAL_URI_DB = process.env.LOCAL_URI_DB;
exports.SALT_ROUNDS = Number(process.env.SALT_ROUNDS);
exports.ACCESS_TOKEN_KEY = process.env.ACCESS_TOKEN_KEY;
exports.PREFIX = process.env.PREFIX;
exports.REFRESH_TOKEN_KEY = process.env.REFRESH_TOKEN_KEY;
exports.REDIS_URL = process.env.REDIS_URL;
exports.WHITE_LIST = process.env.WHITE_LIST ? process.env.WHITE_LIST.split(",") : [];
