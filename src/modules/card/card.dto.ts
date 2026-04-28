import * as z from "zod";
import { addCaredSchema, delCardSchema, setDefaultCardSchema } from "./card.validation";


export type IAddCardType = z.infer<typeof addCaredSchema.body>
export type IDelCardType = z.infer<typeof delCardSchema.params>
export type ISetDefaultCardType = z.infer<typeof setDefaultCardSchema.params>
