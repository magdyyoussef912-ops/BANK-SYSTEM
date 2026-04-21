
import  * as z from "zod"

export const statusSchema = {
    query:z.object({
        from:z.date(),
        to:z.date()
    })
}