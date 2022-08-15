import Head from "next/head";
import Default from "../../components/Default";
import Header from "../../components/Header";

export default function FourOhFour() {
  return (
    <div>
      <Head>
        <title>LovePets Amor aos animais</title>
      </Head>
      <Header />
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Default type="not_found" />
      </div>
    </div>
  );
}
