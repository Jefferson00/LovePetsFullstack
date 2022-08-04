import { GetServerSideProps } from "next";
import Head from "next/head";
import {
  ChangeEvent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Header from "../../../components/Header";
import { api, getAPIClient } from "../../../services/api";
import getDistanceLocation from "../../../utils/getDistanceLocation";
import getDistanceTime from "../../../utils/getDistanceTime";
import styles from "./styles.module.scss";
import { MdCameraAlt, MdDelete, MdPets } from "react-icons/md";
import Input from "../../../components/Input";
import { FormHandles } from "@unform/core";
import { Form } from "@unform/web";
import dynamic from "next/dynamic";
import { IoMdFemale, IoMdMale } from "react-icons/io";
import {
  GiCat,
  GiClownfish,
  GiRabbit,
  GiRat,
  GiSittingDog,
} from "react-icons/gi";
import Button from "../../../components/Button";
import { ToastContext } from "../../../context/ToastContext";
import getValidationErrors from "../../../utils/getValidationErrors";
import * as Yup from "yup";

import {
  IAge,
  IGender,
  IPetData,
  IPetImages,
  IPets,
  ISpecie,
} from "../../../utils/interfaces";
import router from "next/router";
import { parseCookies } from "nookies";

interface ImgData {
  id?: string;
  preview: string;
  raw: File;
}

interface PetFormData {
  name: string;
  description: string;
}

interface NewPetProps {
  pet?: IPets;
  location: {
    current_latitude: string;
    currrent_longitude: string;
  };
}

export default function NewPet({ pet, location }: NewPetProps) {
  const { addToast } = useContext(ToastContext);

  const MapComponent = useMemo(
    () =>
      dynamic(() => import("../../../components/Map"), {
        loading: () => (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
            }}
          >
            carregando...
          </div>
        ),
        ssr: false,
      }),
    []
  );

  const formRef = useRef<FormHandles>(null);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<ImgData[]>([]);
  const [latitude, setLatitude] = useState(Number(location.current_latitude));
  const [longitude, setLongitude] = useState(
    Number(location.currrent_longitude)
  );
  const [specie, setSpecie] = useState<ISpecie>(null);
  const [age, setAge] = useState<IAge>(null);
  const [gender, setGender] = useState<IGender>(null);

  const handleDeleteImageState = async (image: ImgData) => {
    setImages((images) => images.filter((i) => i.preview !== image.preview));
    if (image.id) {
      await api.delete(`images/${image.id}`, {
        data: {
          pet_id: pet.id,
        },
      });
    }
  };

  const selectLocation = useCallback((lat: string, lon: string) => {
    setLatitude(Number(lat));
    setLongitude(Number(lon));
  }, []);

  const handleChangeImagesState = ({
    target,
  }: ChangeEvent<HTMLInputElement>) => {
    if (target.files) {
      if (
        target.files[0].type === "image/jpeg" ||
        target.files[0].type === "image/png" ||
        target.files[0].type === "image/jpge" ||
        target.files[0].type === "image/svg"
      ) {
        setImages([
          ...images,
          {
            preview: URL.createObjectURL(target.files[0]),
            raw: target.files[0],
          },
        ]);
      }
    }
  };

  const verifyFields = useCallback(() => {
    if (images.length === 0) {
      addToast({
        type: "error",
        title: "Erro no cadastro",
        message: "Selecione ao menos uma imagem para continuar",
      });
      return false;
    }
    if (!specie) {
      addToast({
        type: "error",
        title: "Erro no cadastro",
        message: "Selecione uma espécie para continuar",
      });
      return false;
    }
    if (!age) {
      addToast({
        type: "error",
        title: "Erro no cadastro",
        message: "Selecione uma idade para continuar",
      });
      return false;
    }
    if (!gender) {
      addToast({
        type: "error",
        title: "Erro no cadastro",
        message: "Selecione um genêro para continuar",
      });
      return false;
    }
    return true;
  }, [gender, age, specie, images]);

  const handleSubmit = useCallback(
    async (data: PetFormData) => {
      if (!verifyFields()) return;

      setLoading(true);
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required("Nome é obrigatório!"),
          description: Yup.string().required("Descrição obrigatória"),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const petData: IPetData = {
          name: data.name,
          description: data.description,
          age: age,
          gender: gender,
          species: specie,
          is_adopt: false,
          location_lat: String(latitude),
          location_lon: String(longitude),
          city: "Ceilândia",
          state: "DF",
        };

        let response = null;

        if (pet) {
          await api.put(`pets/${pet.id}`, petData);
        } else {
          response = await api.post("/pets", petData);
        }

        const id = response ? response.data.id : pet?.id;

        await Promise.all(
          images.map(async (image) => {
            if (image.raw) {
              const dataImage = new FormData();

              dataImage.append("image", image.raw);
              dataImage.append("pet_id", id);

              if (image.id) {
                await api.patch(`images/${image.id}`, dataImage).catch(() => {
                  addToast({
                    type: "error",
                    title: "Erro no upload da imagem",
                    message:
                      "Não foi possível cadastrar a imagem, tente novamente.",
                  });
                });
              } else {
                await api.patch("images", dataImage).catch(() => {
                  addToast({
                    type: "error",
                    title: "Erro no upload da imagem",
                    message:
                      "Não foi possível cadastrar a imagem, tente novamente.",
                  });
                });
              }
            }
          })
        );

        addToast({
          type: "success",
          title: `Anúncio ${pet ? "atualizado" : "cadastrado"} com sucesso`,
          message: "",
        });

        router.back();
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);

          formRef.current?.setErrors(errors);

          addToast({
            type: "error",
            title: `Erro ${pet ? "na atualização" : "no cadastro"}`,
            message: "Preencha todos os campos corretamente.",
          });

          return;
        }

        console.log(error);

        addToast({
          type: "error",
          title: `Erro ${pet ? "na atualização" : "no cadastro"}`,
          message: "Tente novamente mais tarde.",
        });
      } finally {
        setLoading(false);
      }
    },
    [verifyFields, longitude, latitude, images, pet]
  );

  useEffect(() => {
    if (pet) {
      setLatitude(Number(pet.location_lat));
      setLongitude(Number(pet.location_lon));
      setSpecie(pet.species);
      setAge(pet.age);
      setGender(pet.gender);

      const imgArr: ImgData[] = [];

      console.log(pet.images);

      pet.images.map((image) => {
        imgArr.push({
          preview: image.image_url,
          raw: null,
          id: image.id,
        });
      });

      setImages(imgArr);
    }
  }, [pet]);

  return (
    <div>
      <Head>
        <title>Novo Anúncio | LovePets Amor aos animais</title>
      </Head>
      <Header />
      <div className={styles.homeContainer}>
        <strong>Novo Anúncio</strong>

        <Form
          ref={formRef}
          onSubmit={handleSubmit}
          style={{ width: "100%" }}
          initialData={{
            name: pet?.name,
            description: pet?.description,
          }}
        >
          <div className={styles.formContainer}>
            <div className={styles.imageContainer}>
              {images.length > 0 ? (
                <div className={styles.imageWrapper}>
                  <img src={images[0].preview} />
                  <button
                    type="button"
                    onClick={() => handleDeleteImageState(images[0])}
                  >
                    <MdDelete size={24} color="#ee1717" />
                  </button>
                </div>
              ) : (
                <div className={styles.defaultIcon}>
                  <MdPets size={135} color="#ee1717" />
                </div>
              )}
              <span>
                {images.length > 1 ? (
                  images.map((image, index) => {
                    if (image?.preview && index > 0)
                      return (
                        <div
                          className={styles.imageWrapper}
                          key={Math.random()}
                        >
                          <img src={image.preview} />
                          <button
                            type="button"
                            onClick={() => handleDeleteImageState(image)}
                          >
                            <MdDelete size={20} color="#ee1717" />
                          </button>
                        </div>
                      );
                  })
                ) : (
                  <>
                    <div className={styles.defaultIcon}>
                      <MdPets size={54} color="#ee1717" />
                    </div>
                    <div className={styles.defaultIcon}>
                      <MdPets size={54} color="#ee1717" />
                    </div>
                    <div className={styles.defaultIcon}>
                      <MdPets size={54} color="#ee1717" />
                    </div>
                  </>
                )}
              </span>
              {images.length < 4 && (
                <label htmlFor="avatar">
                  <MdCameraAlt size={20} color="#fff" />
                  <input
                    type="file"
                    id="avatar"
                    onChange={handleChangeImagesState}
                  />
                </label>
              )}
            </div>

            <div className={styles.speciesContainer}>
              <div>
                <button
                  type="button"
                  onClick={() => setSpecie("dog")}
                  style={{
                    background: specie === "dog" ? "#12BABA" : "#fff",
                    border: specie === "dog" ? "none" : "1px solid #c4c4c4",
                  }}
                >
                  <GiSittingDog
                    size={32}
                    color={specie === "dog" ? "#fff" : "#c4c4c4"}
                  />
                </button>

                <button
                  type="button"
                  onClick={() => setSpecie("rodent")}
                  style={{
                    background: specie === "rodent" ? "#12BABA" : "#fff",
                    border: specie === "rodent" ? "none" : "1px solid #c4c4c4",
                  }}
                >
                  <GiRat
                    size={32}
                    color={specie === "rodent" ? "#fff" : "#c4c4c4"}
                  />
                </button>
                <button
                  type="button"
                  onClick={() => setSpecie("fish")}
                  style={{
                    background: specie === "fish" ? "#12BABA" : "#fff",
                    border: specie === "fish" ? "none" : "1px solid #c4c4c4",
                  }}
                >
                  <GiClownfish
                    size={32}
                    color={specie === "fish" ? "#fff" : "#c4c4c4"}
                  />
                </button>
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => setSpecie("cat")}
                  style={{
                    background: specie === "cat" ? "#12BABA" : "#fff",
                    border: specie === "cat" ? "none" : "1px solid #c4c4c4",
                  }}
                >
                  <GiCat
                    size={32}
                    color={specie === "cat" ? "#fff" : "#c4c4c4"}
                  />
                </button>
                <button
                  type="button"
                  onClick={() => setSpecie("rabbit")}
                  style={{
                    background: specie === "rabbit" ? "#12BABA" : "#fff",
                    border: specie === "rabbit" ? "none" : "1px solid #c4c4c4",
                  }}
                >
                  <GiRabbit
                    size={32}
                    color={specie === "rabbit" ? "#fff" : "#c4c4c4"}
                  />
                </button>
                <button
                  type="button"
                  onClick={() => setSpecie("others")}
                  style={{
                    background: specie === "others" ? "#12BABA" : "#fff",
                    border: specie === "others" ? "none" : "1px solid #c4c4c4",
                  }}
                >
                  <MdPets
                    size={32}
                    color={specie === "others" ? "#fff" : "#c4c4c4"}
                  />
                </button>
              </div>
            </div>

            <div className={styles.ageContainer}>
              <label>Idade</label>
              <div>
                <button
                  type="button"
                  style={{
                    backgroundColor: age === "- 1 ano" && "#12BABA",
                    color: age === "- 1 ano" && "#fff",
                  }}
                  onClick={() => setAge("- 1 ano")}
                >
                  menos que 1 ano
                </button>
                <button
                  type="button"
                  style={{
                    backgroundColor: age === "1 ano" && "#12BABA",
                    color: age === "1 ano" && "#fff",
                  }}
                  onClick={() => setAge("1 ano")}
                >
                  1 ano
                </button>
                <button
                  type="button"
                  style={{
                    backgroundColor: age === "2 anos" && "#12BABA",
                    color: age === "2 anos" && "#fff",
                  }}
                  onClick={() => setAge("2 anos")}
                >
                  2 anos
                </button>
                <button
                  type="button"
                  style={{
                    backgroundColor: age === "3 anos" && "#12BABA",
                    color: age === "3 anos" && "#fff",
                  }}
                  onClick={() => setAge("3 anos")}
                >
                  3 anos
                </button>
                <button
                  type="button"
                  style={{
                    backgroundColor: age === "+ 3 anos" && "#12BABA",
                    color: age === "+ 3 anos" && "#fff",
                  }}
                  onClick={() => setAge("+ 3 anos")}
                >
                  mais que 3 anos
                </button>
              </div>
            </div>

            <div className={styles.genderContainer}>
              <label>Gênero</label>
              <div>
                <button
                  type="button"
                  onClick={() => setGender("male")}
                  style={{
                    backgroundColor: gender === "male" && "#12BABA",
                    color: gender === "male" ? "#fff" : "#4E4D4D",
                  }}
                >
                  <IoMdMale color={gender === "male" ? "#fff" : "#12BABA"} />
                  Macho
                </button>
                <button
                  type="button"
                  onClick={() => setGender("female")}
                  style={{
                    backgroundColor: gender === "female" && "#12BABA",
                    color: gender === "female" ? "#fff" : "#4E4D4D",
                  }}
                >
                  <IoMdFemale
                    color={gender === "female" ? "#fff" : "#ED9090"}
                  />
                  Femea
                </button>
              </div>
            </div>

            <div className={styles.inputsContainer}>
              <Input
                name="name"
                type="text"
                placeholder="Nome"
                height={"4rem"}
                width={"50%"}
              />
              <Input
                width={"50%"}
                name="description"
                isTextarea
                placeholder="Breve descrição"
              />
            </div>

            <div className={styles.locationContainer}>
              <MapComponent
                latitude={latitude}
                longitude={longitude}
                onSelectLocation={selectLocation}
              />
            </div>

            <div className={styles.buttonContainer}>
              <Button type="submit">{pet ? "Atualizar" : "Publicar"}</Button>
            </div>
          </div>
        </Form>
      </div>

      {loading && (
        <div className={styles.loadingModalContainer}>
          <img src="/loading-dog.gif" alt="carregando" />
        </div>
      )}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  let pet: IPets = null;
  const petId = context.query.pet;
  const apiClient = getAPIClient(context);

  const { ["@LovePetsBeta:location_latitude"]: latitude } =
    parseCookies(context);
  const { ["@LovePetsBeta:location_longitude"]: longitude } =
    parseCookies(context);

  let current_latitude = "-15.778189";
  let currrent_longitude = "-48.139945";

  if (latitude) {
    current_latitude = latitude;
  }

  if (longitude) {
    currrent_longitude = longitude;
  }

  if (petId) {
    const findPetImages = async (pet_id: string): Promise<IPetImages[]> => {
      let images: IPetImages[] = [];
      try {
        const response = await apiClient.get(`/images/${pet_id}`);
        images = response.data;
      } catch (error) {}
      return images;
    };

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

    const { data } = await apiClient.get(`/pets/find/${petId}`);

    pet = data;
    pet = await setPetImages(pet);
  }

  return {
    props: {
      pet,
      location: {
        current_latitude,
        currrent_longitude,
      },
    },
  };
};
