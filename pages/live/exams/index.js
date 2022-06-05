import axiosInstance from "../../../components/axiosInstance";
import { useState } from "react";
import Logo from "../../../components/logo/logo";
import Alertbox from "../../../components/alertbox";
import AlertMessenger from "../../../components/alertMessenger";
import { getCookie, setCookies } from "cookies-next";
import Loader from "../../../components/logo/loader";
import { useRouter } from "next/router";
import Footer from "../../../components/footer";
import Link from "next/link";

function ExamList({ myCourses, userId }) {
  const router = useRouter();
  let [toOpen, setToOpen] = useState("");
  let [accessModal, setAccessModal] = useState(false);
  let [alertMessage, setAlertMessage] = useState("");
  let [modalState, setModalState] = useState(false);
  let [accessKey, setAccessKey] = useState("");
  let [loading, setLoading] = useState(false);
  let [endPrompt, setEndPrompt] = useState(false);
  let [courses, setCourses] = useState(myCourses);
  let [dupcourses, setdupCourses] = useState(myCourses);

  function checkAccess(index) {
    setToOpen(courses[index].identifier);
    setAccessModal(true);
  }

  function endExam(index) {
    setToOpen(courses[index].identifier);
    setEndPrompt(true);
  }

  function removeExam() {
    setLoading(true);
    axiosInstance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${getCookie("accessToken")}`;
    axiosInstance
      .post("/remove_exam/" + toOpen, { id: getCookie("id") })
      .then((response) => {
        if (response.data.modifiedCount > 0) {
          setLoading(false);
          setAlertMessage("Exam successfully ended.");
          setModalState(true);
          setEndPrompt(false);
        }
      });
  }

  async function verifyAccessKey() {
    if (accessKey != "") {
      setLoading(true);
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${getCookie("accessToken")}`;
      let { data } = await axiosInstance.post(
        "/verify_exam_access_key/" + toOpen,
        {
          id: getCookie("id"),
          accessKey,
        }
      );
      if (data == "Access granted") {
        setLoading(false);
        setCookies("write_exam", toOpen);
        router.push("/live/exams/write");
      } else if (data == "Access denied") {
        setLoading(false);
        setAlertMessage("Access denied");
        setModalState(true);
      }
    }
  }

  function findExam(e) {
    let searchCharacters = e.target.value.toLowerCase();
    let filtered = dupcourses.filter((course) =>
      course.title.toLowerCase().includes(searchCharacters)
    );
    setCourses([...filtered])
  }

  return (
    <div className="h-screen bg-gray-100 font-archivo">
      {modalState == true && (
        <AlertMessenger message={alertMessage} setModalState={setModalState} />
      )}
      {endPrompt == true && (
        <div className="fixed top-0 inset-0 bg-gray-700 flex z-30 justify-center bg-opacity-30 font-archivo">
          <div className="mt-7 p-5 bg-white w-full md:w-1/3 h-48 rounded">
            <div className="text-2xl text-red-600">End Exam</div>
            <div className="mt-3 text-gray-600">
              Are you sure you want to end all access to this exam?
            </div>
            <div className="flex mt-5 justify-between items-center">
              <button
                onClick={() => setEndPrompt(false)}
                className="w-1/3 bg-red-500 hover:bg-red-400 text-red-50 p-2 rounded"
              >
                No
              </button>
              <button
                onClick={removeExam}
                className="w-1/3 hover:bg-green-500 bg-green-600 text-green-50 p-2 rounded"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
      {loading == true && <Loader />}
      {accessModal == true && (
        <div className="fixed top-0 flex justify-center inset-0 bg-opacity-40 bg-gray-700 z-10">
          <div className="mt-5 bg-white p-3 h-64 w-full md:w-1/3 md:rounded-lg relative">
            <button
              onClick={() => {
                setAccessModal(false);
                setAccessKey("");
              }}
              className="absolute top-0 right-2"
            >
              &times;
            </button>
            <div className="text-xl pl-3 text-green-700">Enter Access Key</div>
            <div>
              <Alertbox message="You will be provided with the Access Key." />
            </div>
            <div className="pl-3">
              <input
                value={accessKey}
                onChange={(e) => setAccessKey(e.target.value)}
                onKeyDown={(e) => (e.key == "Enter" ? verifyAccessKey() : null)}
                className="text-sm text-gray-600 focus:outline-none p-3 w-full rounded bg-gray-200"
                type="text"
                placeholder="Enter Access key here..."
              />
            </div>
            <div className="mt-2 flex justify-end p-4">
              <button
                onClick={verifyAccessKey}
                className="py-2 px-4 rounded hover:bg-green-500 text-green-50 bg-green-600"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex p-5">
        <Logo />
      </div>
      <div className="flex w-full justify-center">
        <div className="md:w-1/2 w-full p-3">
          <div className="text-2xl text-green-700">All Exams</div>
          <div>
            <input
              className="p-2 w-full mt-2 rounded bg-gray-200 focus:outline-none text-gray-600"
              type="text"
              placeholder="Search exam name..."
              onChange={findExam}
            />
          </div>
          <div className="mt-3">
            <Link href="/live/exams/statistics" className="text-blue-500">
              Statistics
            </Link>
            {courses.map((course, index) => {
              return (
                <div
                  key={index}
                  className="p-5 bg-white mt-2 rounded md:shadow-sm flex"
                >
                  <div className="w-2/3">
                    <div className="text-green-800">{course.title}</div>
                    <div className="text-green-500 text-sm flex items-center">
                      {course.writable == true ? (
                        <div className="text-green-500 text-sm flex items-center">
                          <div className="w-1 h-1 rounded-full bg-green-400 mr-2"></div>{" "}
                          Active
                        </div>
                      ) : (
                        <div className="text-red-500 text-sm flex items-center">
                          <div className="w-1 h-1 rounded-full bg-red-400 mr-2"></div>{" "}
                          Inactive
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="w-1/3">
                    {course.creator == userId ? (
                      <button
                        onClick={() => endExam(index)}
                        disabled={course.writable == false ? true : false}
                        className={
                          course.writable == false
                            ? "w-full p-2 bg-gray-400 rounded text-gray-50"
                            : "w-full p-2 bg-red-500 hover:bg-red-400 rounded text-red-50"
                        }
                      >
                        End
                      </button>
                    ) : (
                      <button
                        onClick={() => checkAccess(index)}
                        disabled={course.writable == false ? true : false}
                        className={
                          course.writable == false
                            ? "w-full p-2 bg-gray-400 rounded text-gray-50"
                            : "w-full p-2 bg-green-600 hover:bg-green-500 rounded text-green-50"
                        }
                      >
                        Write
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
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
  let { data } = await axiosInstance.post("/get_live_exams", { id });
  let response = await axiosInstance.post("/decryptId", { encryptedId: id });
  if (data.name != undefined) {
    return {
      redirect: {
        destination: "/login",
      },
    };
  } else {
    return {
      props: { myCourses: data, userId: response.data.decryptedId },
    };
  }
}

export default ExamList;
