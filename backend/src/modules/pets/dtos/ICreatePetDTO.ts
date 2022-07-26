export default interface ICreatePetDTO {
    name: string;
    user_id: string;
    species:string;
    is_adopt: boolean;
    age:string;
    gender:string;
    description:string;
    location_lat:string;
    location_lon:string;
    city:string;
    state:string;
}