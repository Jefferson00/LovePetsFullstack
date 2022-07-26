import { Request, Response } from "express";
import { container } from "tsyringe";
import { classToClass } from 'class-transformer';

import CreateFavUserPetsService from "@modules/pets/services/create/CreateFavUserPetsService";
import FindFavUserPetsService from "@modules/pets/services/find/FindFavUserPetsService";
import DeleteFavUserPetsService from "@modules/pets/services/delete/DeleteFavUserPetsService";

export default class FavUserPetsController {
    public async index(request: Request, response: Response): Promise<Response> {
        const user_id = request.user.id;

        const findFavUserPets = container.resolve(FindFavUserPetsService);

        const favs = await findFavUserPets.execute(
            user_id
        );

        return response.json(classToClass(favs));
    }

    public async create(request: Request, response: Response): Promise<Response> {
        const user_id = request.user.id;
        const { pets_id } = request.body;

        const createFavUserPets = container.resolve(CreateFavUserPetsService);

        const fav = await createFavUserPets.execute(
            user_id,
            pets_id,
        );

        return response.json(fav);
    }

    public async delete(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;

        const deleteFav = container.resolve(DeleteFavUserPetsService);

        await deleteFav.execute(id);

        return response.send();
    }
}