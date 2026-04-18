import { Router } from "express";
import authService from "./auth.service";
import { Validation } from "../../common/middleware/validation";
import * as UV  from "./auth.validation";

const authRouter = Router({strict:true})


authRouter.post("/register",Validation(UV.signupSchema),authService.signUP)
authRouter.post("/login",Validation(UV.signinSchema),authService.signIN)



export default authRouter