import axiosInstance from "../../../components/axiosInstance";
import { useEffect, useState } from "react";
import Logo from "../../../components/logo/logo";
import Loader from "../../../components/logo/loader";
import LiveCourseLister from "../../../components/course/livecourseLister";
import Footer from "../../../components/footer";
import AlertMessenger from "../../../components/alertMessenger";

function Courses({ data }) {
  let [loading, setLoading] = useState(false);
  let [courses, setCourses] = useState([]);
  let [dupcourses, setdupCourses] = useState([]);
  let [modalState, setModalState] = useState(false);
  let [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    setLoading(true);
    setCourses(data);
    setdupCourses(data);
    setLoading(false);
  }, [data]);

  function filterCourses(e) {
    let searchCharacters = e.target.value.toLowerCase();
    let found = dupcourses.filter((course) =>
      course.title.toLowerCase().includes(searchCharacters)
    );
    setCourses([...found]);
  }

  return (
    <div className="bg-gray-100 min-h-screen font-archivo">
      {modalState == true && (
        <AlertMessenger setModalState={setModalState} message={modalMessage} />
      )}
      {loading == true && <Loader />}
      <div className="flex p-5 justify-start">
        <Logo />
      </div>
      <div className="flex flex-col items-center w-full">
        <div className="md:w-1/2 w-full p-3">
          <div className="text-2xl text-green-700">Available Courses</div>
          <div>
            <input
              type="text"
              placeholder="Search course name..."
              className="bg-gray-200 mt-3 p-2 w-full rounded shadow-sm focus:outline-none text-sm"
              onChange={filterCourses}
            />
          </div>
          <div className="w-full mt-5">
            {courses.length > 0 ? (
              <LiveCourseLister
                details={courses}
                setLoading={setLoading}
                setModalMessage={setModalMessage}
                setModalState={setModalState}
              />
            ) : (
              <div className="h-64 bg-gray-50 w-full border text-gray-600 rounded border-gray-400 flex justify-center items-center">
                There are no courses available for viewing
              </div>
            )}
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
  const { id, accessToken } = context.req.cookies;
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
  let response = await axiosInstance.post("get_deployed_courses", { id });

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
