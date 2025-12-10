import background from "../assets/background.png";
import FormLogin from "./components/FormLogin";

const LoginPage = () => {
  return (
    <main className="max-h-screen max-w-screen flex overflow-hidden">
      <div className="w-[60%] h-full">
        <img
          src={background}
          className="min-h-screen w-full object-cover"
          alt=""
        />
      </div>
      <FormLogin />
    </main>
  );
};

export default LoginPage;
