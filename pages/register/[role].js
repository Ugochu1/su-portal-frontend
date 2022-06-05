import { useForm } from "react-hook-form";
import FormText from "../../components/form-input/FormText";
import formList from "../../components/form-input/formList";
import Logo from "../../components/logo/logo";
import axiosInstance from "../../components/axiosInstance";
import { useState } from "react";
import { useRouter } from "next/router";
import Loader from "../../components/logo/loader";
import Link from "next/link";
import Footer from "../../components/footer";
import { setCookies } from "cookies-next";

function Login() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm(); // Collect everything from react-hook-form

  function onSubmit(data) {
    setLoading(true);
    axiosInstance
      .post("/signup/" + router.query.role, data)
      .then((response) => {
        if (response.data.message === "This user exists") {
          alert(response.data.message);
          router.push("/login");
        } else if (
          response.data.message === "1 user has been created successfully"
        ) {
          alert(
            "User created successfully. You will be redirected to the Login page"
          );
          router.push("/login");
        }
      });
  }

  return (
    <div className="bg-gray-50 flex flex-col items-center">
      {loading === true && <Loader />}
      <div className="logo p-5">
        <Logo />
      </div>
      <div className="w-full md:w-1/3 relative bg-white py-10 px-4 rounded shadow-md">
        <div className="text-center text-2xl font-archivo mb-10 text-green-700 tracking-tight">
          Register your account
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormText
            formArray={formList.Register}
            register={register}
            errors={errors}
            defaultValue=""
          />
          <div className="flex justify-end">
            <button className="py-1 px-4 rounded bg-green-700 w-full shadow-md mt-10 border-2 border-green-700 text-green-50 font-archivo uppercase">
              Register
            </button>
          </div>
          <div className="mt-2 text-sm text-green-500 font-archivo">
            <Link href="/login">Login instead</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export async function getStaticPaths() {
  return {
    paths: [{ params: { role: "admin" } }, { params: { role: "user" } }],
    fallback: false
  };
}

export async function getStaticProps() {
  return {
    props: {},
  };
}

export default Login;
