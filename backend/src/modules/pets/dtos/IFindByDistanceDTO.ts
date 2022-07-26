export default interface IFindByDistanceDTO{
    location_lat:string;
    location_lon:string;
    distance:string;
    species?:string;
    gender?:string;
    limit?:number;
    skip?:number;
}