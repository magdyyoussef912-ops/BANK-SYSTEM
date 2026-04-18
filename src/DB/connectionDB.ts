import mongoose from "mongoose";
import { LOCAL_URI_DB } from "../config/config.service";


export const checkConnectionDB = async () => {
    try {
        await mongoose.connect(LOCAL_URI_DB)
        console.log("Database connected successfully......")
    } catch (error) {
        console.log(error)
    }
}
