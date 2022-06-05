import Alertbox from "../../components/alertbox";
import Logo from "../../components/logo/logo";
import Image from "next/image";
import { AiOutlinePlus } from "react-icons/ai";
import Footer from "../../components/footer";
import CourseInitializer from "../../components/course/courseInit";
import { useState } from "react";
import { useRouter } from "next/router";
import AlertMessenger from "../../components/alertMessenger";

function DevelopmentMode() {
  const router = useRouter();
  let [show, setShow] = useState(false);
  let [modalMessage, setModalMessage] = useState("");
  let [modalState, setModalState] = useState(false);

  function changeState() {
    setShow(true);
  }

  function showCourses() {
    router.push("/development-mode/courses");
  }

  return (
    <div className="h-full bg-gray-100 font-archivo">
      {modalState == true && (
        <AlertMessenger message={modalMessage} setModalState={setModalState} />
      )}
      {show == true && (
        <CourseInitializer
          setShow={setShow}
          setModalMessage={setModalMessage}
          setModalState={setModalState}
        />
      )}

      <div className="flex justify-start p-5 mb-4">
        <Logo />
      </div>
      <div className="flex flex-col items-center">
        <div className="md:w-1/2 w-full">
          <Alertbox message="You are in development mode" />
        </div>
        <div className="md:w-1/2 p-3 w-full mt-5 md:flex">
          <div className="w-full md:w-1/2 h-40 md:h-64 p-1">
            <div className="flex justify-around md:flex-col m-1 bg-white h-full shadow border items-center p-5">
              <div className="flex flex-col justify-center items-center">
                <Image
                  src="/online-course.png"
                  alt="Course Image"
                  width={80}
                  height={80}
                />
                <div className="font-bold text-gray-700 mt-2">Courses</div>
              </div>
              <div className="w-1/2 flex flex-col items-center">
                <div className="flex items-center justify-center w-full">
                  <button
                    onClick={changeState}
                    className="text-3xl border-2 hover:bg-gray-200 text-gray-600 mr-2 border-gray-700 w-8 h-8 rounded-full flex justify-center items-center"
                  >
                    <AiOutlinePlus />
                  </button>
                  <button
                    onClick={showCourses}
                    className="px-3 py-1 hover:bg-gray-500 bg-gray-700 rounded-md text-gray-50 border-gray-300"
                  >
                    UPDATE
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 h-40 md:h-64 p-1">
            <div className="flex justify-around md:flex-col m-1 bg-white h-full shadow border items-center p-5">
              <div className="flex flex-col justify-center items-center">
                <Image
                  src="/exam.png"
                  alt="Exam Image"
                  width={90}
                  height={90}
                />
                <div className="font-bold text-gray-700">Exams</div>
              </div>
              <div className="w-1/2">
                <div className="flex items-center justify-center w-full">
                  <button onClick={() => router.push("/development-mode/exams/initialize-exam")} className="text-3xl border-2 hover:bg-gray-200 text-gray-600 mr-2 border-gray-700 w-8 h-8 rounded-full flex justify-center items-center">
                    <AiOutlinePlus />
                  </button>
                  <button onClick={() => router.push("/development-mode/exams/")} className="px-3 py-1 hover:bg-gray-500 bg-gray-700 rounded-md text-gray-50 border-gray-300">
                    UPDATE
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-32">
        <Footer />
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  let { role, id, adminToken } = context.req.cookies;

  if (id == undefined || adminToken == undefined) {
    return {
      redirect: {
        destination: "/login"
      }
    }
  }

  if (role == "admin") {
    return {
      props: {},
    };
  } else {
    return {
      redirect: {
        destination: "/",
      },
    };
  }
}

export default DevelopmentMode;
