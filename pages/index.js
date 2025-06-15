import { useEffect, useState } from "react";
import axiosInstance from "../components/axiosInstance";
import { useRouter } from "next/router";
import Logo from "../components/logo/logo";
import { BsStarFill } from "react-icons/bs";
import { FiSettings } from "react-icons/fi";
import { MdNotificationsActive } from "react-icons/md";
import { RiMessageFill } from "react-icons/ri";
import Footer from "../components/footer";
import Loader from "../components/logo/loader";
import { getCookie, setCookies, removeCookies } from "cookies-next";

function Dashboard({ data, notifs, messages }) {
  let router = useRouter();
  let [loading, setLoading] = useState(false);
  let [notificationNumber, setNotificationNumber] = useState(0);
  let [courseLength, setCourseLength] = useState(0);

  useEffect(() => {
    setLoading(true);
    setCookies("role", data.role);
    setLoading(false);
  }, [data.role]);

  useEffect(() => {
    setNotificationNumber(notifs.length);
    setCourseLength(data.courses.length);
  }, [data.courses.length, notifs.length]);

  function goDevelopment() {
    router.push("/development-mode");
  }

  function goToCourses() {
    router.push("/live/courses");
  }

  return (
    <>
      <div className="min-h-screen w-full bg-gray-100 font-archivo">
        {loading == true && <Loader />}
        <div className="flex justify-between items-center p-5">
          <Logo />
          <div
            onClick={() => {
              removeCookies("id");
              removeCookies("accessToken");
              removeCookies("exam");
              removeCookies("adminToken");
              router.push("/login");
            }}
            className="cursor-pointer text-green-500"
          >
            Logout
          </div>
          {/* <div className="text-2xl ml-2 font-bold text-green-600">Scripture Union</div> */}
        </div>
        <div className="w-full md:flex md:justify-center">
          <div className="md:w-2/3 p-5 bg-white shadow">
            <div className="flex items-center w-full">
              <div className="flex items-center w-2/3">
                <div className="text-2xl md:text-3xl p-2 text-green-900">
                  Hi, {data.firstname}{" "}
                </div>
                <div className="text-orange-500">
                  {data.role === "admin" && <BsStarFill scale={20} />}
                </div>
              </div>

              <div className="w-1/3 flex justify-end">
                {data.role === "admin" && (
                  <div
                    onClick={goDevelopment}
                    className="h-full text-green-900 hover:text-green-600 flex flex-col justify-center items-center cursor-pointer"
                  >
                    <FiSettings size={22} />
                    <div className="text-xs">Development</div>
                  </div>
                )}
              </div>
            </div>
            <div className="text-sm mt-1 pl-2">
              {data.phone_number}. {data.email}
            </div>
          </div>
        </div>

        <div className="flex justify-center text-gray-500 mt-5">
          <div
            className="m-3 hover:text-gray-400 flex flex-col items-center justify-center cursor-pointer relative"
            onClick={() => {
              router.push("/notifications");
            }}
          >
            <MdNotificationsActive size={25} />
            <div className="text-xs">Notifications</div>
            {notificationNumber > 0 && (
              <div className="absolute top-0 rounded-full text-red-50 right-4 px-1.5 bg-red-500 text-xs text-center">
                {notificationNumber}
              </div>
            )}
          </div>
        </div>

        <div className="w-full md:flex md:justify-center ">
          <div className="md:w-2/3 p-5 ">
            <div className="flex flex-wrap md:justify-center">
              <div className="md:w-1/3 w-full">
                <div className="m-1 bg-white p-3 h-52 md:h-60 flex flex-col shadow rounded-md">
                  <div className="text-lg text-green-900">Courses</div>
                  <hr />
                  <div className="h-full flex flex-col justify-between">
                    <div className="h-3/4 flex justify-around items-center">
                      <div
                        onClick={() => router.push("/live/courses/mylist")}
                        className="p-4 border h-20 w-20 cursor-pointer hover:bg-gray-100 rounded-full border-gray-500 text-gray-600 flex justify-center items-center text-2xl"
                      >
                        {courseLength}
                      </div>
                    </div>
                    <button
                      className="w-full h-1/4 rounded bg-green-600 hover:bg-green-500 text-green-50 p-1 text-sm mt-5"
                      onClick={goToCourses}
                    >
                      Add Course
                    </button>
                  </div>
                </div>
              </div>

              <div className="md:w-1/3 w-full h-full">
                <div className="m-1 bg-white p-3 h-52 flex flex-col md:h-60 shadow rounded-md">
                  <div className="text-lg text-green-900">Examinations</div>
                  <hr />
                  <div className="h-full">
                    {data.school == "" ? (
                      <div className="h-full flex flex-col justify-between">
                        <div
                          onClick={() => router.push("/live/exams/statistics")}
                          className="mt-2 h-3/4 text-sm text-green-700 cursor-pointer hover:text-green-500 flex flex-col justify-center items-center"
                        >
                          <div className="flex items-end">
                            <div className="h-3 mr-1 w-2 bg-green-700"></div>
                            <div className="h-4 w-2 mr-1 bg-red-700"></div>
                            <div className="h-5 w-2 bg-green-700"></div>
                          </div>
                          <div className="mt-2">Statistics</div>
                        </div>
                        <button
                          onClick={() => router.push("/live/exams")}
                          className="w-full h-1/4 hover:bg-green-500 rounded bg-green-600 text-green-50 p-1 text-sm mt-5"
                        >
                          Go To Exams
                        </button>
                      </div>
                    ) : (
                      data.school
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
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
  const response = await axiosInstance.post("/dashboard", { id });
  const notif_response = await axiosInstance.post("/getunreadnotifications", {
    id,
  });
  let courses = [];
  response.data.courses.forEach((course) => {
    courses.push(course.identifier);
  });

  if (response.data.name != undefined) {
    return {
      redirect: {
        destination: "/login",
      },
    };
  } else {
    return {
      props: {
        data: response.data,
        notifs: notif_response.data,
      },
    };
  }
}

export default Dashboard;
