import ICacheProvider from "@shared/container/providers/CacheProvider/models/ICacheProvider";
import { classToClass } from "class-transformer";
import { inject, injectable } from "tsyringe";
import Image from "../../infra/typeorm/entities/Image";
import IImagesRepository from "../../repositories/IImagesRepository";


@injectable()
class FindImagesService {
  constructor(
    @inject('ImagesRepository')
    private imagesRepository: IImagesRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) { }

  public async execute(pet_id: string): Promise<Image[]> {
    const key = `pet-images-list:${pet_id}`;

    let images = await this.cacheProvider.recover<Image[]>(
      key,
    );

    if (!images) {
      images = await this.imagesRepository.findByPetId(pet_id);

      await this.cacheProvider.save(key, classToClass(images));
    }

    return images;
  }
}

export default FindImagesService;