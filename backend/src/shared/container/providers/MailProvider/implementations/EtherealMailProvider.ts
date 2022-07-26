import {inject, injectable} from 'tsyringe';
import IMailProvaider from "../models/IMailProvider";
import nodemailer, {Transporter} from 'nodemailer';
import ISendMailDTO from "../dtos/ISendMailDTO";
import IMailTemplateProvaider from "../../MailTemplateProvider/models/IMailTemplateProvider";

@injectable()
export default class EtherealMailProvider implements IMailProvaider{
    private client: Transporter;

    constructor(
        @inject('MailTemplateProvider')
        private mailTemplateProvider: IMailTemplateProvaider
    ){
        nodemailer.createTestAccount().then(
            account => {
                const transporter = nodemailer.createTransport({
                    host: account.smtp.host,
                    port: account.smtp.port,
                    secure: account.smtp.secure,
                    auth: {
                        user: account.user,
                        pass: account.pass
                    }
                });
        
                this.client = transporter;
            }
        );
    }

    public async sendMail({from, to, subject, templateData }: ISendMailDTO):Promise<void>{
        const message = await this.client.sendMail({
            from: {
                name: from?.name || 'Suporte LovePets',
                address: from?.email || 'suporte@lovepets.com.br',
            },
            to: {
                name: to.name,
                address: to.email,
            },
            subject,
            html: await this.mailTemplateProvider.parse(templateData)
        });
        console.log('Message sent: ', message.messageId);
        console.log('Preview URL: ', nodemailer.getTestMessageUrl(message));
    }
}