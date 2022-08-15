import styles from "./style.module.scss";

interface DefaultContainerProps {
  type: "favs" | "pets" | "not_found";
}

export default function Default({ type }: DefaultContainerProps) {
  return (
    <>
      <div className={styles.defaultContainer}>
        {type === "pets" && (
          <>
            <strong>Sem anúncios ainda.</strong>
            <img src="/default-dog.svg" alt="sem anúncios" />
          </>
        )}
        {type === "favs" && (
          <>
            <strong>Sem favoritos ainda.</strong>
            <img src="/default-cat.svg" alt="sem favoritos" />
          </>
        )}
        {type === "not_found" && (
          <>
            <strong>Erro 404 - Página não encotrada</strong>
            <img src="/default-dog.svg" alt="sem favoritos" />
          </>
        )}
      </div>
    </>
  );
}
