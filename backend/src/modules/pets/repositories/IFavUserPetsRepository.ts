import FavUserPets from "../infra/typeorm/entities/FavUserPets";

export default interface IFavUserPetsRepository{
    create(user_id:string, pet_id:string): Promise<FavUserPets>;
    findById(id:string): Promise<FavUserPets | undefined>;
    findByUser(user_id:string): Promise<FavUserPets[]>;
    findByUserAndPet(user_id:string, pet_id:string): Promise<FavUserPets>;
    delete(id:string): Promise<void>;
}