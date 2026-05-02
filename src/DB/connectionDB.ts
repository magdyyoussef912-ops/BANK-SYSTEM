import mongoose from "mongoose";
import { DB_URI_ONLINE, LOCAL_URI_DB } from "../config/config.service";


export const checkConnectionDB = async () => {
    try {
        await mongoose.connect(DB_URI_ONLINE)
        console.log(`Database ${DB_URI_ONLINE} connected successfully......`)
    } catch (error) {
        console.log(error)
    }
}
