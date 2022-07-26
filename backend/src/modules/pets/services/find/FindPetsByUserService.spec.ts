import FakePetsRepository from "../../repositories/fakes/FakePetsRepository";
import FakeUsersRepository from "@modules/users/repositories/fakes/FakeUsersRepository";
import CreatePetService from "../create/CreatePetService";
import FindPetsByUserService from './FindPetsByUserService';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';


let fakePetsRepository: FakePetsRepository;
let fakeUsersRepository: FakeUsersRepository;
let fakeCacheProvider: FakeCacheProvider;
let findPetsByUser: FindPetsByUserService;
let createPetsRepository: CreatePetService;

describe('FindPetByUser', () => {
    beforeEach(() => {
        fakePetsRepository = new FakePetsRepository();
        fakeUsersRepository = new FakeUsersRepository();
        fakeCacheProvider = new FakeCacheProvider();

        createPetsRepository = new CreatePetService(
            fakePetsRepository, fakeUsersRepository, fakeCacheProvider
        );

        findPetsByUser = new FindPetsByUserService(
            fakePetsRepository, fakeCacheProvider
        );
    });

    it('should be able to find pets by an user', async () => {
        const user = await fakeUsersRepository.create({
            name: 'Jeffin',
            email: 'jeffin@jeffin.com',
            password: '123456',
            phone: '61 0000000',
        });

        const pet = await createPetsRepository.execute({
            name: 'Bixano',
            species: 'cat',
            age: '1 ano',
            description: 'description',
            gender: 'male',
            is_adopt: false,
            user_id: user.id,
            location_lat: '-15.785647',
            location_lon: '-48.141282',
            city: 'brasília',
            state: 'DF'
        });

        const pet2 = await createPetsRepository.execute({
            name: 'Bixano',
            species: 'cat',
            age: '1 ano',
            description: 'description',
            gender: 'male',
            is_adopt: false,
            user_id: user.id,
            location_lat: '-15.805086',
            location_lon: '-48.121796',
            city: 'brasília',
            state: 'DF'
        });

        const pets = await findPetsByUser.execute(user.id);

        expect(pets).toEqual([pet, pet2]);
    });
});