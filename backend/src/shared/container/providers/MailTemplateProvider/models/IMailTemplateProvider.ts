import IParseMailTemplateDTO from "../dtos/IParseMailTemplateDTO";

export default interface IMailTemplateProvaider{
    parse(data: IParseMailTemplateDTO): Promise<string>;
}