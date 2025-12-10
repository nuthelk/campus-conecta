import background from "../../assets/background.png";
import FormRegister from "./components/FormRegister";

const RegisterPage = () => {
  return (
    <main className="max-h-screen max-w-screen flex overflow-hidden">
      <div className="w-[60%]">
        <img
          src={background}
          alt=""
          className="w-full min-h-screen object-cover"
        />
      </div>
      <FormRegister />
    </main>
  );
};

export default RegisterPage;
