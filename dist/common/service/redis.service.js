"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const config_service_1 = require("../../config/config.service");
class redisService {
    Client;
    constructor() {
        this.Client = (0, redis_1.createClient)({
            url: config_service_1.REDIS_URL,
        });
        this.handlerDisconnect();
    }
    async handlerDisconnect() {
        this.Client.on("error", (error) => {
            console.log("Redis error: ", error);
        });
    }
    async connect() {
        await this.Client.connect();
        console.log("Redis connection Seccssefully........");
    }
    revoked_token = ({ userId, jti }) => {
        return `revoke_token::${userId}::${jti}`;
    };
    revoked_id_token = ({ userId }) => {
        return `revoke_token::${userId}`;
    };
    setValue = async ({ key, value, ttl }) => {
        try {
            const data = typeof (value) == "string" ? value : JSON.stringify(value);
            return ttl ? await this.Client.set(key, data, { EX: ttl }) : await this.Client.set(key, data);
        }
        catch (error) {
            console.log(error, "fail to set operation");
        }
    };
    update = async ({ key, value }) => {
        try {
            if (!await this.Client.exists(key))
                return 0;
            return await this.setValue({ key, value });
        }
        catch (error) {
            console.log(error, "fail to set operation");
        }
    };
    get = async (key) => {
        try {
            try {
                return JSON.parse(await this.Client.get(key));
            }
            catch (error) {
                return await this.Client.get(key);
            }
        }
        catch (error) {
            console.log(error, "fail to set operation");
        }
    };
    ttl = async (key) => {
        try {
            return await this.Client.ttl(key);
        }
        catch (error) {
            console.log(error, "fail to ttl operation");
        }
    };
    exists = async (key) => {
        try {
            return await this.Client.exists(key);
        }
        catch (error) {
            console.log(error, "fail to exists operation");
        }
    };
    expire = async ({ key, ttl }) => {
        try {
            return await this.Client.expire(key, ttl);
        }
        catch (error) {
            console.log(error, "fail to expire operation");
        }
    };
    del = async (key) => {
        try {
            if (!key.length)
                return 0;
            return await this.Client.del(key);
        }
        catch (error) {
            console.log(error, "fail to del operation");
        }
    };
    keys = async (pattern) => {
        try {
            return await this.Client.keys(`${pattern}*`);
        }
        catch (error) {
            console.log(error, "fail to keys operation");
        }
    };
    Incr = async (pattern) => {
        try {
            return await this.Client.incr(pattern);
        }
        catch (error) {
            console.log(error, "fail to Incr operation");
        }
    };
}
exports.default = new redisService();
