import { inject, injectable } from "tsyringe";

import Pet from "../../infra/typeorm/entities/Pet";
import IPetsRepository from "../../repositories/IPetsRepository";

@injectable()
class FindPetsByIdService {
  constructor(
    @inject('PetsRepository')
    private petsRepository: IPetsRepository,
  ) { }

  public async execute(id: string): Promise<Pet | undefined> {

    const pet = await this.petsRepository.findById(id);


    return pet;
  }
}

export default FindPetsByIdService;