import ICacheProvider from "@shared/container/providers/CacheProvider/models/ICacheProvider";
import { classToClass } from "class-transformer";
import { inject, injectable } from "tsyringe";

import Pet from "../../infra/typeorm/entities/Pet";
import IPetsRepository from "../../repositories/IPetsRepository";

@injectable()
class FindPetsByUserService {
    constructor(
        @inject('PetsRepository')
        private petsRepository: IPetsRepository,

        @inject('CacheProvider')
        private cacheProvider: ICacheProvider,
    ) { }

    public async execute(user_id: string): Promise<Pet[]> {
        const key = `user-pets-list:${user_id}`;

        let petsByUser = await this.cacheProvider.recover<Pet[]>(
            key,
        );

        if (!petsByUser) {
            petsByUser = await this.petsRepository.findByUser(user_id);

            await this.cacheProvider.save(key, classToClass(petsByUser));
        }

        return petsByUser;
    }
}

export default FindPetsByUserService;