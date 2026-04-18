"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validation = void 0;
const error_global_handler_1 = require("../utils/error.global.handler");
const Validation = (schema) => {
    return (req, res, next) => {
        let validationError = [];
        for (const key of Object.keys(schema)) {
            if (!schema[key])
                continue;
            const result = schema[key].safeParse(req[key]);
            if (!result.success) {
                result.error.issues.forEach((element) => {
                    validationError.push({
                        path: element.path[0],
                        message: element.message
                    });
                });
            }
        }
        if (validationError.length > 0) {
            throw new error_global_handler_1.AppError(JSON.parse(JSON.stringify(validationError)), 400);
        }
        next();
    };
};
exports.Validation = Validation;
