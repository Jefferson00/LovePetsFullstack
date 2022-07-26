interface ILocation{
    lat: string;
    lon:string;
}

export default interface IGeoProvider {
    getDistance(from: ILocation, to: ILocation): number;
    convertDistance(distance: number, targetUnit: string): number;
}