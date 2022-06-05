import FormText from "../form-input/FormText";
import formList from "../form-input/formList";
import { useForm } from "react-hook-form";
import Alertbox from "../alertbox";
import Loader from "../logo/loader";
import axiosInstance from "../axiosInstance";
import { useState } from "react";
import { useRouter } from "next/router";
import Logo from "../logo/logo";
import { getCookie } from "cookies-next";

function CourseInitializer(props) {
  let [loading, setLoading] = useState(false);
  let router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm(); // Collect everything from react-hook-form

  async function onSubmit(data) {
    setLoading(true);
    data.id = getCookie("id");
    axiosInstance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${getCookie("adminToken")}`;
    const response = await axiosInstance.post("/create_course", data);
    props.setModalState(true);
    props.setModalMessage(response.data.message);
    props.setShow(false);
    setLoading(false);
  }

  function closeModal() {
    props.setShow(false);
  }

  return (
    <div className="h-screen w-full fixed z-10 bg-gray-700 bg-opacity-30 flex justify-center font-archivo">

      {loading == true && <Loader />}
      <div className="h-2/3 md:w-1/3 w-full mt-16 bg-white opacity-100 shadow-md rounded-md p-5">
        <div className="text-2xl text-green-800 px-3">Initialize Course</div>
        <hr />
        <div className="mt-8">
          <Alertbox message="Fill in the form to initialize a course" />
        </div>
        <div className="p-3 mt-5">
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormText
              formArray={formList.courseInit}
              register={register}
              errors={errors}
              defaultValue=""
            />
            <div className="p-3 flex justify-between">
              <button className="bg-green-700 p-2 rounded-md shadow text-green-50">
                Initialize
              </button>
              <button
                onClick={closeModal}
                className="bg-green-50 border border-green-700 p-2 rounded-md shadow text-green-700"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CourseInitializer;
