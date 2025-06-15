import axiosInstance from "../../../components/axiosInstance";
import { useEffect, useState } from "react";
import Logo from "../../../components/logo/logo";
import Loader from "../../../components/logo/loader";
import MyCourseLister from "../../../components/course/mycourselister";
import Footer from "../../../components/footer";
import { useRouter } from "next/router";
import AlertMessenger from "../../../components/alertMessenger";

function MyCourses(props) {
  let [loading, setLoading] = useState(false);
  let [courses, setCourses] = useState([]);
  let [dupcourses, setdupCourses] = useState([]);
  let [modalState, setModalState] = useState(false);
  let [modalMessage, setModalMessage] = useState("");
  let router = useRouter();

  useEffect(() => {
    setLoading(true);
    setCourses(props.courses);
    setdupCourses(props.courses);
    setLoading(false);
  }, [props.courses]);

  function filterCourses(e) {
    let searchCharacters = e.target.value.toLowerCase();
    let found = dupcourses.filter((course) =>
      course.title.toLowerCase().includes(searchCharacters)
    );
    setCourses([...found]);
  }

  return (
    <>
      <div className="bg-gray-100 min-h-screen font-archivo">
        {modalState == true && (
          <AlertMessenger
            setModalState={setModalState}
            message={modalMessage}
          />
        )}
        {loading == true && <Loader />}
        <div className="flex p-5 justify-start">
          <Logo />
        </div>
        <div className="flex flex-col items-center w-full">
          <div className="md:w-1/2 w-full p-3">
            <div className="text-2xl text-green-700">Enrolled Courses</div>
            <div>
              <input
                onChange={filterCourses}
                className="w-full p-2 bg-gray-200 shadow-sm rounded mt-3 text-sm focus:outline-none"
                type="text"
                placeholder="Search course name..."
              />
            </div>
            <div className="w-full mt-5">
              {courses.length > 0 ? (
                <MyCourseLister
                  details={courses}
                  setLoading={setLoading}
                  setModalMessage={setModalMessage}
                  setModalState={setModalState}
                />
              ) : (
                <div className="w-full text-gray-500 bg-gray-50 h-64 border border-gray-400 rounded flex justify-center items-center">
                  You are not enrolled in any course
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export async function getServerSideProps(context) {
  let { id, accessToken } = context.req.cookies;
  if (id == undefined || accessToken == undefined) {
    return {
      redirect: {
        destination: "/login",
      },
    };
  }
  axiosInstance.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${accessToken}`;
  let response = await axiosInstance.post("/dashboard", { id });
  if (response.data.name != undefined) {
    return {
      redirect: {
        destination: "/login",
      },
    };
  } else {
    return {
      props: response.data,
    };
  }
}

export default MyCourses;
