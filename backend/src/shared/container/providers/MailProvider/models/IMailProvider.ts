import ISendMailDTO from "../dtos/ISendMailDTO";

export default interface IMailProvaider{
    sendMail(data: ISendMailDTO): Promise<void>;
}