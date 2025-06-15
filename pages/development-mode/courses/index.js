import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axiosInstance from "../../../components/axiosInstance";
import CourseLister from "../../../components/course/courseLister";
import Logo from "../../../components/logo/logo";
import Alertbox from "../../../components/alertbox";
import Footer from "../../../components/footer";
import Loader from "../../../components/logo/loader";
import AlertMessenger from "../../../components/alertMessenger";

function Courses(props) {
  let [courses, setCourses] = useState([]);
  let [dupcourses, setdupCourses] = useState([]);
  let [loading, setLoading] = useState(false);
  let [modalMessage, setModalMessage] = useState("");
  let [modalState, setModalState] = useState(false);
  let router = useRouter();

  function filterCourses(e) {
    let searchCharacters = e.target.value.toLowerCase();
    let fullCourseList = [...dupcourses];
    let displayedCourses = fullCourseList.filter((course) => {
      return course.title.toLowerCase().includes(searchCharacters);
    });
    setCourses([...displayedCourses]);
  }

  useEffect(() => {
    setCourses(props.data);
    setdupCourses(props.data);
  }, [props]);

  return (
    <>
      <div className="bg-gray-100 min-h-screen font-archivo">
        {modalState == true && (
          <AlertMessenger
            message={modalMessage}
            setModalState={setModalState}
          />
        )}
        {loading == true && <Loader />}
        <div className="flex p-5 sticky z-10">
          <Logo />
        </div>
        <div className="w-full flex flex-col items-center">
          <div className="md:w-1/2 sticky z-10 w-full">
            <Alertbox message="You are in development mode" />
          </div>
          <div className="md:w-1/2 w-full">
            <div className="p-3 text-green-800 text-2xl">
              Courses in development
            </div>
            <div className="px-3">
              <input
                type="text"
                placeholder="Search course name..."
                className="p-2 w-full bg-gray-200 rounded shadow-sm focus:outline-none text-sm"
                onChange={filterCourses}
              />
            </div>
          </div>

          <div className="md:w-1/2 w-full mt-3">
            <div className="p-3">
              <CourseLister
                details={courses}
                setLoading={setLoading}
                setModalMessage={setModalMessage}
                setModalState={setModalState}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export async function getServerSideProps(context) {
  const { id, adminToken } = context.req.cookies;

  if (id == undefined || adminToken == undefined) {
    return {
      redirect: {
        destination: "/login",
      },
    };
  }

  axiosInstance.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${adminToken}`;
  const response = await axiosInstance.post("/development_courses", { id });
  if (response.data.name != undefined) {
    return {
      redirect: {
        destination: "/login",
      },
    };
  } else {
    return {
      props: { data: response.data },
    };
  }
}

export default Courses;
