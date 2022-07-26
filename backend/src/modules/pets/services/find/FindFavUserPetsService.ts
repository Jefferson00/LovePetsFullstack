import { inject, injectable } from "tsyringe";
import FavUserPets from "../../infra/typeorm/entities/FavUserPets";
import ICacheProvider from "@shared/container/providers/CacheProvider/models/ICacheProvider";

import IFavUserPetsRepository from "../../repositories/IFavUserPetsRepository";
import { classToClass } from "class-transformer";

@injectable()
class FindFavUserPetsService {
    constructor(
        @inject('FavUserPetsRepository')
        private favUserPetsRepository: IFavUserPetsRepository,

        @inject('CacheProvider')
        private cacheProvider: ICacheProvider,
    ) { }

    public async execute(user_id: string): Promise<FavUserPets[]> {
        const key = `user-favs-pets-list:${user_id}`;
        let favs = await this.cacheProvider.recover<FavUserPets[]>(
            key,
        );

        if (!favs) {
            favs = await this.favUserPetsRepository.findByUser(user_id);

            await this.cacheProvider.save(key, classToClass(favs));
        }

        return favs;
    }
}

export default FindFavUserPetsService;