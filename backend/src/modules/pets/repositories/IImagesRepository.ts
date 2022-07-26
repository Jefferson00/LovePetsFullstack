import ICreateImageDTO from "../dtos/ICreateImageDTO";
import Image from "../infra/typeorm/entities/Image";

export default interface IImagesRepository{
    create (data: ICreateImageDTO): Promise<Image>;
    findByPetId (pet_id: string): Promise<Image[]>;
    findById (id: string): Promise<Image>;
    save(data: Image): Promise<Image>;
    delete(id: string): Promise<void>;
}