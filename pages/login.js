import { useForm } from "react-hook-form";
import FormText from "../components/form-input/FormText";
import formList from "../components/form-input/formList";
import Logo from "../components/logo/logo";
import axiosInstance from "../components/axiosInstance";
import { useState } from "react";
import Loader from "../components/logo/loader";
import Alertbox from "../components/alertbox";
import { useRouter } from "next/dist/client/router";
import { setCookies } from "cookies-next";
import Link from "next/link";

function Login() {
  const [loading, setLoading] = useState(false);
  const [receivedResponse, setreceivedResponse] = useState(false);
  const [receivedMessage, setreceivedMessage] = useState("");
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm(); // Collect everything from react-hook-form

  function onSubmit(data) {
    let { phone_or_email, password } = data;
    let loginObject = {
      phone_number: phone_or_email,
      email: phone_or_email,
      password,
    };

    setLoading(true);
    axiosInstance.post("/login", loginObject).then((response) => {
      setLoading(false);
      if (response.data.message !== undefined) {
        setreceivedResponse(true);
        setreceivedMessage(response.data.message);
      } else {
        setreceivedResponse(false);
        setCookies("accessToken", response.data.accessToken);
        setCookies("adminToken", response.data.adminToken);
        setCookies("id", response.data.encryptedId);
        router.push("/");
      }
    });
  }

  return (
    <div className="bg-gray-50 h-screen flex flex-col items-center">
      {loading === true && <Loader />}
      <div className="logo p-5">
        <Logo width={40} height={40} />
      </div>
      <div className="w-full md:w-1/3 bg-white py-10 px-4 rounded shadow-md">
        <div className="text-center text-2xl font-archivo mb-10 text-green-700 tracking-tight">
          Login to your account
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormText
            formArray={formList.Login}
            register={register}
            errors={errors}
            defaultValue=""
          />
          <div className="flex justify-end">
            <button className="py-1 px-4 rounded bg-green-700 w-full shadow-md mt-10 border-2 border-green-700 text-green-50 font-archivo uppercase">
              Log In
            </button>
          </div>
        </form>
        {receivedResponse === true && <Alertbox message={receivedMessage} />}
      </div>
      <div className="mt-3 text-sm font-archivo flex">
        Do not have an account?{" "}
        <div className="text-green-500 ml-1">
          <Link href="/register/user">Register</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
