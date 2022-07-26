import { convertDistance, getDistance } from "geolib";
import IGeoProvider from "../models/IGeoProvider";

interface ILocation{
    lat: string;
    lon:string;
}

export default class GeolibProvider implements IGeoProvider{
    public getDistance(from: ILocation, to: ILocation): number {
        return getDistance(from, to);
    }

    public convertDistance(distance: number, targetUnit: string): number {
        return convertDistance(distance, targetUnit);
    }
}