export type ISpecie = "dog" | "cat" | "rodent" | "rabbit" | "fish" | "others";
export type IAge = "- 1 ano" | "1 ano" | "2 anos" | "3 anos" | "+ 3 anos";
export type IGender = "male" | "female";

export interface IPetImages {
  id: string | null;
  pet_id: string;
  image: string;
  image_url: string | null;
}

export interface IPetData {
  name: string;
  description: string;
  species: string;
  age: string;
  gender: string;
  is_adopt: boolean;
  location_lat: string;
  location_lon: string;
  city: string;
  state: string;
}

export interface IPets {
  id: string;
  name: string;
  user_id: string;
  species: ISpecie;
  is_adopt: boolean;
  age: IAge;
  gender: IGender;
  description: string;
  location_lat: string;
  location_lon: string;
  city: string;
  state: string;
  distanceLocation: number;
  distanceTime: string;
  created_at: Date;
  updated_at: Date;
  user_name: string;
  user_phone: string;
  user_avatar: string;
  images: IPetImages[];
}
