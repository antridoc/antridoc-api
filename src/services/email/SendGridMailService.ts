import { MailDataRequired, MailService } from "@sendgrid/mail";
import AppConfig from "../../config/AppConfig";
import { EmailSenderService } from "./EmailSender";

export class SendGridMailService extends EmailSenderService{

    service: MailService = new MailService();

    constructor() {
        super();
        this.service.setApiKey(AppConfig.SENDGRID_API_KEY)
    }

    async send(): Promise<void> {
        try {
            await this.service.send(this.options as MailDataRequired)
        } catch (error) {
            if (error.response) {
                throw new Error('mail sender failed!')
            }
        } 
    }
}