import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

@injectable()
class DeleteUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) { }
  public async execute(id: string): Promise<void> {
    const checkUserExists = await this.usersRepository.findById(id);

    if (!checkUserExists) {
      throw new AppError('User not found.');
    }

    if (checkUserExists.avatar) {
      await this.storageProvider.deleteFile(checkUserExists.avatar);
    }

    await this.usersRepository.delete(id);

    await this.cacheProvider.invalidatePrefix(`pets-list`);
    await this.cacheProvider.invalidatePrefix(`user-favs-pets-list`);
    //await this.cacheProvider.invalidate(`user-pets-list:${id}`);
  }
}

export default DeleteUserService;