import { EmailEnum } from "../../enum/user.enum"
import redisService from "../../service/redis.service"
import { AppError } from "../error.global.handler"
import { Hash } from "../security/hash.security"
import { bankEmailTemplate } from "./email.Template"
import { generateOtp, sendEmail } from "./sendEmail"



export const sendEmailOtp =async (
    {email,subject}:{email:string,subject:string}
)=>{


        const is_Blocked = await redisService.get(redisService.block_otp_key({email}))
        if (is_Blocked !== null) {
            throw new AppError(`Blocked try again after 3 minutes`)
        }
    
        const TTlValue = await redisService.ttl(redisService.otp_key({email,subject:subject as EmailEnum}))
        if ( Number(TTlValue) > 0 && TTlValue !== undefined) {
            throw new AppError(`Can't send otp after ${TTlValue} seconds`);
        }
    
        const max_tries  = await redisService.get(redisService.max_otp_key({email}))
        if (Number(max_tries) >=3 ) {
            await redisService.setValue({key:redisService.block_otp_key({email}),value:1,ttl:3*60})
            throw new AppError("you have exceeded the maximum number of tries")
        }
    
    
        const otp :number = await generateOtp()

        await sendEmail({to:email,subject:"Welcome in bank secure",html:bankEmailTemplate(otp)})
        const value = await Hash({plainText:`${otp}`})
        
    
        await redisService.setValue({key:redisService.otp_key({email,subject:subject as EmailEnum}),value,ttl:10*60})
        await redisService.Incr(redisService.max_otp_key({email}))


}