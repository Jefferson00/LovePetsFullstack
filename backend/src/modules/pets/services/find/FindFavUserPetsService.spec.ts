import FakeFavUserPetsRepository from '../../repositories/fakes/FakeFavUserPetsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FindFavUserPetsService from './FindFavUserPetsService';


let fakeFavUserPetsRepository: FakeFavUserPetsRepository;
let fakeCacheProvider: FakeCacheProvider;

let findFavUserPets: FindFavUserPetsService;

describe('FindPetByUser', () => {
    beforeEach(() => {
        fakeFavUserPetsRepository = new FakeFavUserPetsRepository();
        fakeCacheProvider = new FakeCacheProvider();

        findFavUserPets = new FindFavUserPetsService(
            fakeFavUserPetsRepository, fakeCacheProvider
        );
    });

    it('should be able to find favs pets by an user', async () => {
        const fav1 = await fakeFavUserPetsRepository.create(
            'user_1',
            'pet_1',
        );
        const fav2 = await fakeFavUserPetsRepository.create(
            'user_1',
            'pet_2',
        );
        const fav3 = await fakeFavUserPetsRepository.create(
            'user_2',
            'pet_1',
        );

        const favs = await findFavUserPets.execute(
            'user_1'
        );

        expect(favs).toEqual([fav1, fav2]);
    });
});