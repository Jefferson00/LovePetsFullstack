import { GetServerSideProps } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import Card from "../../../components/Card";
import Header from "../../../components/Header";
import Default from "../../../components/Default";
import { api, getAPIClient } from "../../../services/api";
import { parseCookies } from "nookies";
import getDistanceLocation from "../../../utils/getDistanceLocation";
import getDistanceTime from "../../../utils/getDistanceTime";
import styles from "./styles.module.scss";
import { IFavsData, IPetImages, IPets } from "../../../utils/interfaces";

interface HomeProps {
  favs: IFavsData[];
}

export default function MyFavs(props: HomeProps) {
  const [myFavs, setMyFavs] = useState<IFavsData[]>([]);

  const handleDeleteFavPet = async (id: string) => {
    try {
      await api.delete(`favs/${id}`);

      setMyFavs(myFavs.filter((favs) => favs.id !== id));
    } catch (error) {}
  };

  useEffect(() => {
    setMyFavs(props.favs);
  }, [props.favs]);

  return (
    <div>
      <Head>
        <title>Meus Favoritos | LovePets Amor aos animais</title>
      </Head>
      <Header />
      <div className={styles.homeContainer}>
        {myFavs.length === 0 && <Default type="favs" />}
        {myFavs.map((fav) => {
          return (
            <Card
              key={fav.id}
              pet={fav.pet}
              fav={fav}
              onDelete={handleDeleteFavPet}
            />
          );
        })}
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  let petsArr: IFavsData[] = [];
  const apiClient = getAPIClient(context);

  const { ["@LovePetsBeta:token"]: token } = parseCookies(context);

  if (!token) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const setPetImages = async (petsArr: IFavsData[]): Promise<IFavsData[]> => {
    const mapPromises = petsArr.map(async (fav) => {
      let petsWithImages = Object.assign({}, fav);
      petsWithImages.pet.images = await findPetImages(fav.pet.id);
      petsWithImages.pet.distanceLocation = getDistanceLocation({
        fromLat: "-15.778189",
        fromLon: "-48.139945",
        toLat: fav.pet.location_lat,
        toLon: fav.pet.location_lon,
      });
      petsWithImages.pet.distanceTime = getDistanceTime(fav.pet.created_at);

      return petsWithImages;
    });
    return await Promise.all(mapPromises);
  };

  const findPetImages = async (pet_id: string): Promise<IPetImages[]> => {
    let images: IPetImages[] = [];
    try {
      const response = await apiClient.get(`/images/${pet_id}`);
      images = response.data;
    } catch (error) {}
    return images;
  };

  const { data } = await apiClient.get("/favs");

  petsArr = data;
  petsArr = await setPetImages(petsArr);

  return {
    props: {
      favs: petsArr,
    },
  };
};
