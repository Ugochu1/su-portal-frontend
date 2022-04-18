import { useForm } from "react-hook-form";
import FormText from "../components/form-input/FormText";
import formList from "../components/form-input/formList";
import Logo from "../components/logo/logo";

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm(); // Collect everything from react-hook-form

  function onSubmit(data) {
    console.log(data);
  }

  return (
    <div className="bg-green-50 h-screen font-fredoka flex flex-col justify-center items-center">
      <div className="logo">
        <Logo />
      </div>
      <div className="w-full lg:w-1/3 bg-white py-10 px-4 rounded shadow-md">
        <div className="text-center text-2xl font-bold mb-10 text-green-700 tracking-tight">
          Login to your account
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormText
            formArray={formList.Login}
            register={register}
            errors={errors}
          />
          <div className="flex justify-end">
            <button className="py-1 px-4 rounded bg-green-700 w-full shadow-md mt-10 border-2 border-green-700 text-green-50 uppercase font-semibold">
              Log In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
