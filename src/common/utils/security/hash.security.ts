import {hash,compare} from "bcrypt"
import { SALT_ROUNDS } from "../../../config/config.service"


export const Hash = async ({plainText,saltRounds=SALT_ROUNDS}:{
    plainText:string,
    saltRounds?:number
}) => {
    return await hash(plainText,Number(saltRounds))
}

export const Compare = async ({plainText,cipherText}:{
    plainText:string,
    cipherText:string
}) => {
    return await compare(plainText,cipherText)
}