import { GetServerSideProps } from "next";
import Head from "next/head";
import { getAPIClient } from "../../services/api";

import getDistanceLocation from "../../utils/getDistanceLocation";
import getDistanceTime from "../../utils/getDistanceTime";

import Card from "../../components/Card";
import Header from "../../components/Header";

import styles from "./styles.module.scss";
import Default from "../../components/Default";
import { IPetImages, IPets } from "../../utils/interfaces";

interface PetsProps {
  pets: IPets;
}

export default function Pets(props: PetsProps) {
  return (
    <div>
      <Head>
        <title>LovePets Amor aos animais</title>
      </Head>
      <Header />
      <div className={styles.container}>
        {props.pets ? <Card pet={props.pets} /> : <Default type="not_found" />}
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params;
  let pets: IPets = null;
  const apiClient = getAPIClient(context);

  const setPetImages = async (pets: IPets): Promise<IPets> => {
    let petsWithImages = Object.assign({}, pets);
    petsWithImages.images = await findPetImages(pets.id);
    petsWithImages.distanceLocation = getDistanceLocation({
      fromLat: "-15.778189",
      fromLon: "-48.139945",
      toLat: pets.location_lat,
      toLon: pets.location_lon,
    });
    petsWithImages.distanceTime = getDistanceTime(pets.created_at);

    return petsWithImages;
  };

  const findPetImages = async (pet_id: string): Promise<IPetImages[]> => {
    let images: IPetImages[] = [];
    try {
      const response = await apiClient.get(`/images/${pet_id}`);
      images = response.data;
    } catch (error) {}
    return images;
  };

  try {
    const { data } = await apiClient.get(`/pets/find/${slug}`);
    if (data) {
      pets = data;
      pets = await setPetImages(pets);
    }
  } catch (error) {}

  return {
    props: {
      pets,
    },
  };
};
