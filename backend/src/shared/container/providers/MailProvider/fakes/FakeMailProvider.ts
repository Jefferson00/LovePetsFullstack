import ISendMailDTO from "../dtos/ISendMailDTO";
import IMailProvaider from "../models/IMailProvider";

export default class FakeMailProvider implements IMailProvaider{
    private messages: ISendMailDTO[] = []

    public async sendMail(message: ISendMailDTO):Promise<void>{
        this.messages.push(message);
    }
}