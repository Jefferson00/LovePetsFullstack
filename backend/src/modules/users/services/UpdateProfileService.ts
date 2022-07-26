import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';
import User from '../infra/typeorm/entities/User';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

interface IRequestDTO {
  user_id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  old_password?: string;
  password?: string;
}

@injectable()
export default class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) { }

  public async execute({
    user_id,
    name,
    email,
    phone,
    avatar,
    password,
    old_password,
  }: IRequestDTO): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found.');
    }

    const checkEmail = await this.usersRepository.findByEmail(email);

    if (checkEmail && checkEmail.id !== user_id) {
      throw new AppError('This email is already used by another user.');
    }

    if (password && !old_password) {
      throw new AppError('You need to inform the current password.');
    }

    if (password && old_password) {
      const checkOldPassword = await this.hashProvider.compareHash(
        old_password,
        user.password,
      );

      if (!checkOldPassword) {
        throw new AppError('Wrong current password.');
      }

      user.password = await this.hashProvider.generateHash(password);
    }

    if (avatar) {
      user.avatar = avatar;
    }

    user.name = name;
    user.email = email;
    user.phone = phone;

    await this.cacheProvider.invalidatePrefix(`pets-list`);
    await this.cacheProvider.invalidatePrefix(`user-favs-pets-list`);

    return this.usersRepository.save(user);
  }
}
