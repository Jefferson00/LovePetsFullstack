
import ICacheProvider from "@shared/container/providers/CacheProvider/models/ICacheProvider";
import IStorageProvider from "@shared/container/providers/StorageProvider/models/IStorageProvider";
import AppError from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";
import Image from "../../infra/typeorm/entities/Image";
import IImagesRepository from "../../repositories/IImagesRepository";

interface RequestDTO {
    id: string;
    image: string;
    pet_id: string;
}

@injectable()
class UpdateImageService {
    constructor(
        @inject('ImagesRepository')
        private imagesRepository: IImagesRepository,

        @inject('StorageProvider')
        private storageProvider: IStorageProvider,

        @inject('CacheProvider')
        private cacheProvider: ICacheProvider,
    ) { }

    public async execute({
        image, pet_id, id
    }: RequestDTO): Promise<Image> {
        const findImage = await this.imagesRepository.findById(id);

        if (pet_id !== findImage.pet_id) {
            throw new AppError('Operation not authorized!');
        }

        if (findImage.image) {
            await this.storageProvider.deleteFile(findImage.image);
        }

        const filename = await this.storageProvider.saveFile(image);

        findImage.image = filename;

        await this.imagesRepository.save(findImage);

        await this.cacheProvider.invalidate(`pet-images-list:${pet_id}`);

        return findImage;
    }
}

export default UpdateImageService;