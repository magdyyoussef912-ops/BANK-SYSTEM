import { Router } from "express";
import { Authentication } from "../../common/middleware/authentication";
import cardService from "./card.service";
import { Validation } from "../../common/middleware/validation";
import  * as  CV from "./card.validation";

const creditCardRouter = Router({strict:true})


creditCardRouter.post("/AddCard",Authentication,Validation(CV.addCaredSchema),cardService.addCard)
creditCardRouter.get("/getAllCards",Authentication,cardService.getAllCards)
creditCardRouter.patch("/setDefaultCard/:cardId",Authentication,Validation(CV.setDefaultCardSchema),cardService.setDefaultCard)
creditCardRouter.delete("/deleteCard/:cardId",Authentication,Validation(CV.delCardSchema),cardService.deleteCard)

export default creditCardRouter  