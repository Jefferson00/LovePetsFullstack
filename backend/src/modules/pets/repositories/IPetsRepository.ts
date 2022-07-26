import ICreatePetDTO from "../dtos/ICreatePetDTO";
import IFindByDistanceDTO from "../dtos/IFindByDistanceDTO";
import Pet from "../infra/typeorm/entities/Pet";

export default interface IPetsRepository {
    create(data: ICreatePetDTO): Promise<Pet>;
    findByDistance(data: IFindByDistanceDTO): Promise<Pet[] | undefined>;
    findByUser(user_id: string): Promise<Pet[] | undefined>;
    findById(id: string): Promise<Pet | undefined>;
    save(data: Pet): Promise<Pet>;
    delete(id: string): Promise<void>;
}