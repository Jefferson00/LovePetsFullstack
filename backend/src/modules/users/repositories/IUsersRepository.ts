import CreateUserDTO from "../dtos/ICreateUserDTO";
import User from "../infra/typeorm/entities/User";

export default interface IUsersRepository {
    findById(id: string): Promise<User | undefined>;
    findByEmail(email: string): Promise<User | undefined>;
    findByEmailOrPhone(email: string, phone: string): Promise<User | undefined>;
    create(data: CreateUserDTO): Promise<User>;
    save(user: User): Promise<User>;
    delete(id: string): Promise<void>;
}