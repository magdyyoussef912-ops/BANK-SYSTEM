import {config} from "dotenv"
import { resolve } from "node:path"


const NODE_ENV : string= process.env.NODE_ENV!

config({
    path:(resolve(process.cwd(),`.env.${NODE_ENV}`))
})

export const PORT :number = Number(process.env.PORT)
export const LOCAL_URI_DB :string = process.env.LOCAL_URI_DB!
export const DB_URI_ONLINE :string = process.env.DB_URI_ONLINE!
export const SALT_ROUNDS :number = Number(process.env.SALT_ROUNDS)
export const ACCESS_TOKEN_KEY :string = process.env.ACCESS_TOKEN_KEY!
export const PREFIX :string = process.env.PREFIX!
export const REFRESH_TOKEN_KEY :string = process.env.REFRESH_TOKEN_KEY!
export const REDIS_URL :string = process.env.REDIS_URL!
export const WHITE_LIST = process.env.WHITE_LIST? process.env.WHITE_LIST.split(","):[] 