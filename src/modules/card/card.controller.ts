import { Router } from "express";
import { Authentication } from "../../common/middleware/authentication";
import cardService from "./card.service";
import { Validation } from "../../common/middleware/validation";
import  * as  CV from "./card.validation";

const creditCardRouter = Router({strict:true})


creditCardRouter.post("/AddCard",Authentication,Validation(CV.addCaredSchema),cardService.addCard)
creditCardRouter.delete("/deleteCard/:cardId",Validation(CV.delCardSchema),cardService.deleteCard)
creditCardRouter.get("/getAllCards",Authentication,cardService.getAllCards)
creditCardRouter.patch("/setDefaultCard/:cardId",Validation(CV.setDefaultCardSchema),cardService.setDefaultCard)

export default creditCardRouter  