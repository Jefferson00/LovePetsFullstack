import IMailTemplateProvaider from "../models/IMailTemplateProvider";

class FakeMailTemplateProvider implements IMailTemplateProvaider{
    public async parse(): Promise<string>{
        return 'Mail content';
    }
}

export default FakeMailTemplateProvider;