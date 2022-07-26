import { inject, injectable } from "tsyringe";

import Pet from "../../infra/typeorm/entities/Pet";
import IPetsRepository from "../../repositories/IPetsRepository";
import IGeoProvider from "../../providers/GeoProvider/models/IGeoProvider";
import ICacheProvider from "@shared/container/providers/CacheProvider/models/ICacheProvider";
import { classToClass } from "class-transformer";



interface RequestDTO {
    location_lat: string;
    location_lon: string;
    distance: string;
    species?: string;
    gender?: string;
    limit?: number;
    skip?: number;
}

@injectable()
class FindPetsByLocationService {
    constructor(
        @inject('PetsRepository')
        private petsRepository: IPetsRepository,

        @inject('GeoProvider')
        private geoProvider: IGeoProvider,

        @inject('CacheProvider')
        private cacheProvider: ICacheProvider,
    ) { }

    public async execute({
        location_lat, location_lon, distance, species, gender, limit, skip
    }: RequestDTO): Promise<Pet[]> {
        const key = `pets-list:${location_lat}-${location_lon}-${distance}-${species}-${gender}-${limit}-${skip}`;

        let pets = await this.cacheProvider.recover<Pet[]>(
            key,
        );

        if (!pets) {
            if (!distance) {
                distance = "50"
            }

            let petsByLocation = await this.petsRepository.findByDistance({
                location_lat, location_lon, distance, species, gender, limit, skip
            });

            if (species !== 'undefined') {
                petsByLocation = petsByLocation.filter(pet => pet.species === species);
            }

            if (gender !== 'undefined') {
                petsByLocation = petsByLocation.filter(pet => pet.gender === gender);
            }

            petsByLocation = petsByLocation.filter(pet => {
                const distanceBetweenLocations = this.geoProvider.getDistance(
                    { lat: location_lat, lon: location_lon },
                    { lat: pet.location_lat, lon: pet.location_lon }
                )
                if (this.geoProvider.convertDistance(distanceBetweenLocations, 'km') <= Number(distance)) {
                    return pet;
                }
            });

            pets = petsByLocation.slice((skip - 1) * limit, skip * limit);
            console.log('location pet')

            await this.cacheProvider.save(key, classToClass(pets));
        }
        return pets;
    }
}

export default FindPetsByLocationService;