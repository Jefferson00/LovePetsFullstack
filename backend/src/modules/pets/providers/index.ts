import { container } from 'tsyringe';
import GeolibProvider from './GeoProvider/implementations/GeolibProvider';
import IGeoProvider from './GeoProvider/models/IGeoProvider';


container.registerSingleton<IGeoProvider>('GeoProvider', GeolibProvider);