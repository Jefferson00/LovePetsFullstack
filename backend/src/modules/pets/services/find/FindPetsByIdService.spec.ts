
import FakePetsRepository from "../../repositories/fakes/FakePetsRepository";
import FindPetsByIdService from './FindPetsByIdService';


let fakePetsRepository: FakePetsRepository;
let findPetsById: FindPetsByIdService;


describe('FindPetsById', () => {
  beforeEach(() => {
    fakePetsRepository = new FakePetsRepository();

    findPetsById = new FindPetsByIdService(
      fakePetsRepository,
    );
  });

  it('should be able to find pet by Id', async () => {
    const pet = await fakePetsRepository.create({
      name: 'Bixano',
      species: 'cat',
      age: '1 ano',
      description: 'description',
      gender: 'male',
      is_adopt: false,
      user_id: 'user.id',
      location_lat: '-15.785647',
      location_lon: '-48.141282',
      city: 'brasília',
      state: 'DF'
    });

    const pets = await findPetsById.execute(pet.id);

    expect(pets).toEqual(pet);
  });
});