import styles from "./style.module.scss";
import Modal from "react-modal";
import {
  IoMdFemale,
  IoMdMale,
  IoMdHeartEmpty,
  IoMdHeart,
  IoMdShare,
  IoMdAlert,
  IoMdTrash,
  IoLogoWhatsapp,
  IoIosArrowDroprightCircle,
  IoIosArrowDropleftCircle,
} from "react-icons/io";
import { Form } from "@unform/web";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { RWebShare } from "react-web-share";
import { api } from "../../services/api";
import { FormHandles } from "@unform/core";
import Radio from "../Radio";
import { ToastContext } from "../../context/ToastContext";
import { MdEdit } from "react-icons/md";
import Link from "next/link";
import { IAge, IFavsData, IPets } from "../../utils/interfaces";

type FormData = {
  denuncia: string;
};

interface CardProps {
  pet: IPets;
  fav?: IFavsData;
  itsMyPet?: boolean;
  itsFav?: boolean;
  onDelete?: (id: string) => Promise<void>;
  toggleFav?: (pets_id: string) => Promise<void>;
}

export default function Card({
  pet,
  itsMyPet,
  fav,
  itsFav,
  onDelete,
  toggleFav,
}: CardProps) {
  const { user } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const formRef = useRef<FormHandles>(null);
  const imageContainer = useRef(null);
  const [petId, setPetId] = useState("");
  const [userId, setUserId] = useState("");
  const [reportModalIsOpen, setReportModalIsOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const reportRadioOptions = [
    { id: "spam", value: "spam", label: "É spam" },
    {
      id: "nudez ou atividade sexual",
      value: "nudez ou atividade sexual",
      label: "Nudez ou atividade sexual",
    },
    {
      id: "simbolos ou discurso de odio",
      value: "simbolos ou discurso de odio",
      label: "Símbolos ou discurso de ódio",
    },
    { id: "violencia", value: "violencia", label: "Violência" },
    {
      id: "golpe ou fraude",
      value: "golpe ou fraude",
      label: "Golpe ou fraude",
    },
    {
      id: "informação falsa",
      value: "informação falsa",
      label: "Informação falsa",
    },
  ];

  useEffect(() => {
    const images = imageContainer.current.querySelectorAll("img");

    images[currentImageIndex].style.opacity = 1;
  }, []);

  const handleReport = useCallback(async (data: FormData) => {
    if (data.denuncia) {
      try {
        await api.post("/report/send", {
          pet_id: petId,
          user_id: userId,
          motivation: data.denuncia,
        });

        setReportModalIsOpen(false);
        addToast({
          type: "success",
          title: "Enviado com sucesso",
          message: "Denuncia encaminhada com sucesso.",
        });
      } catch (error) {
        addToast({
          type: "error",
          title: "Erro na envio",
          message: "Ocorreu algum erro no envio, tente novamente.",
        });
      }
    }
  }, []);

  const openReportModal = (pet_id: string, user_id: string) => {
    setReportModalIsOpen(true);
    setPetId(pet_id);
    setUserId(user_id);
  };

  const handlePrevImage = useCallback(() => {
    const images = imageContainer.current.querySelectorAll("img");
    const length = images.length;
    setCurrentImageIndex(currentImageIndex - 1);

    if (currentImageIndex - 1 < 0) {
      setCurrentImageIndex(0);
    } else {
      let translateRate = (currentImageIndex - 1) * 100;
      //images[currentImageIndex].style.transform = `initial`;
      images[currentImageIndex].style.opacity = 0;

      //images[currentImageIndex - 1].style.transform = `translateX(0)`;
      images[currentImageIndex - 1].style.opacity = 1;
    }
  }, [imageContainer.current, currentImageIndex]);

  const handleNextImage = useCallback(() => {
    const images = imageContainer.current.querySelectorAll("img");
    const length = images.length;
    setCurrentImageIndex(currentImageIndex + 1);

    if (currentImageIndex + 1 >= length) {
      setCurrentImageIndex(length - 1);
    } else {
      let translateRate = (currentImageIndex + 1) * 100;
      //images[currentImageIndex].style.transform = `translateX(-${translateRate}%)`;
      images[currentImageIndex].style.opacity = 0;

      //images[currentImageIndex + 1].style.transform = `translateX(-${translateRate}%)`;
      images[currentImageIndex + 1].style.opacity = 1;
    }
  }, [imageContainer.current, currentImageIndex]);

  const ageTranslate = (age: IAge) => {
    if (age === "- 1 ano") return "menos de 1 ano";
    if (age === "+ 3 anos") return "mais de 3 anos";
    return null;
  };

  return (
    <>
      <div className={styles.card} key={pet.id}>
        <header>
          <span style={{ fontSize: ageTranslate(pet.age) && "0.75rem" }}>
            {ageTranslate(pet.age) ? ageTranslate(pet.age) : pet.age}
          </span>
          <strong>{pet.name}</strong>
          {pet.gender === "female" ? (
            <IoMdFemale size={25} color="#ED9090" />
          ) : (
            <IoMdMale size={25} color="#129CBA" />
          )}
        </header>
        <div className={styles.imageContainer} ref={imageContainer}>
          {pet.images.length > 1 && currentImageIndex > 0 && (
            <button className={styles.buttonPrev} onClick={handlePrevImage}>
              <IoIosArrowDropleftCircle size={25} color="#797979" />
            </button>
          )}
          {pet.images.map((image) => {
            return <img src={image.image_url} alt="pet" key={image.id} />;
          })}
          {pet.images.length > 1 && currentImageIndex + 1 < pet.images.length && (
            <button className={styles.buttonNext} onClick={handleNextImage}>
              <IoIosArrowDroprightCircle size={25} color="#797979" />
            </button>
          )}
        </div>
        <footer>
          <div className={styles.activityContainer}>
            {!itsMyPet ? (
              fav ? (
                <button onClick={() => onDelete(fav.id)}>
                  <IoMdHeart size={25} color="#F43434" />
                </button>
              ) : itsFav ? (
                <button onClick={() => toggleFav(pet.id)}>
                  <IoMdHeart size={25} color="#F43434" />
                </button>
              ) : (
                <button onClick={() => toggleFav(pet.id)}>
                  <IoMdHeartEmpty size={25} color="#F43434" />
                </button>
              )
            ) : (
              <div>
                <button onClick={() => onDelete(pet.id)}>
                  <IoMdTrash size={25} color="#F43434" />
                </button>
                <Link
                  href={{
                    pathname: "/pets/new",
                    query: {
                      pet: pet.id,
                    },
                  }}
                >
                  <a>
                    <MdEdit size={25} color="#129CBA" />
                  </a>
                </Link>
              </div>
            )}

            <div className={styles.dotsIndicators}>
              {pet.images.map((image, index) => {
                if (index === currentImageIndex) {
                  return (
                    <span key={image.id} style={{ background: "#12BABA" }} />
                  );
                } else {
                  return <span key={image.id} />;
                }
              })}
            </div>

            <div className={styles.actionsButtonsContainer}>
              <RWebShare
                data={{
                  text: "Olha só, esse pet fofinho precisa de um novo lar. 😍🥺 ",
                  url: `${process.env.NEXT_PUBLIC_WEB_URL}pets/${pet.id}`,
                  title: "Love pets",
                }}
              >
                <button>
                  <IoMdShare size={25} color="#12BABA" />
                </button>
              </RWebShare>
              {!itsMyPet && (
                <button onClick={() => openReportModal(pet.id, pet.user_id)}>
                  <IoMdAlert size={25} color="#12BABA" />
                </button>
              )}
            </div>
          </div>
          <div className={styles.descriptionContainer}>
            <p>{pet.description}</p>
          </div>

          {!itsMyPet ? (
            <>
              <h4>Entrar em contato:</h4>
              <div className={styles.contactContainer}>
                <div className={styles.userInfo}>
                  <img src={pet.user_avatar} alt="avatar" />
                  <span>{pet.user_name}</span>
                  <a
                    href={`https://api.whatsapp.com/send?phone=${pet.user_phone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <button>
                      <IoLogoWhatsapp size={40} color="#4EC953" />
                    </button>
                  </a>
                </div>

                <div className={styles.locationInfoContainer}>
                  <span>
                    {pet.distanceLocation === 0
                      ? "menos de 1km"
                      : `${pet.distanceLocation} km`}
                  </span>
                  <span>{pet.distanceTime}</span>
                </div>
              </div>
            </>
          ) : (
            <div className={styles.distanceTimeContainer}>
              <span>{pet.distanceTime}</span>
            </div>
          )}
        </footer>
      </div>
      <Modal
        isOpen={reportModalIsOpen}
        onRequestClose={() => setReportModalIsOpen(false)}
        className={styles.reportModal}
        contentLabel="Por que você está denunciando esse anúncio?"
        style={{
          overlay: {
            zIndex: 999,
          },
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
          },
        }}
      >
        <Form
          className={styles.reportForm}
          ref={formRef}
          onSubmit={handleReport}
        >
          <strong className={styles.reportTitle}>
            Por que você está denunciando esse anúncio?
          </strong>
          <Radio name="denuncia" options={reportRadioOptions} />
          <button type="submit">Enviar</button>
        </Form>
      </Modal>
    </>
  );
}
