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
import { IPetImages, IPets } from "../../../utils/interfaces";

interface HomeProps {
  pets: IPets[];
}

export default function MyPets(props: HomeProps) {
  const [myPets, setMyPets] = useState<IPets[]>([]);

  const handleDeleteMyPet = async (pet_id: string) => {
    if (confirm("Deseja realmente excluir?")) {
      try {
        await api.delete(`pets/${pet_id}`);

        setMyPets(myPets.filter((mypets) => mypets.id !== pet_id));
      } catch (error) {}
    }
  };

  useEffect(() => {
    setMyPets(props.pets);
  }, [props.pets]);

  return (
    <div>
      <Head>
        <title>Meus Pets | LovePets Amor aos animais</title>
      </Head>
      <Header />
      <div className={styles.homeContainer}>
        {myPets.length === 0 && <Default type="pets" />}
        {myPets.map((pet) => {
          return (
            <Card
              key={pet.id}
              pet={pet}
              itsMyPet
              onDelete={handleDeleteMyPet}
            />
          );
        })}
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  let petsArr: IPets[] = [];
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

  const setPetImages = async (petsArr: IPets[]): Promise<IPets[]> => {
    const mapPromises = petsArr.map(async (pet) => {
      let petsWithImages = Object.assign({}, pet);
      petsWithImages.images = await findPetImages(pet.id);
      petsWithImages.distanceLocation = getDistanceLocation({
        fromLat: "-15.778189",
        fromLon: "-48.139945",
        toLat: pet.location_lat,
        toLon: pet.location_lon,
      });
      petsWithImages.distanceTime = getDistanceTime(pet.created_at);

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

  const { data } = await apiClient.get("/pets/me");

  petsArr = data;
  petsArr = await setPetImages(petsArr);

  return {
    props: {
      pets: petsArr,
    },
  };
};
