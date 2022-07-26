
import IGeoProvider from "../models/IGeoProvider";

interface ILocation{
    lat: string;
    lon:string;
}

export default class FakeGeoProvider implements IGeoProvider{
    public getDistance(from: ILocation, to: ILocation): number {
        return 0;
    }

    public convertDistance(distance: number, targetUnit: string): number {
        return 0;
    }
}