import { useState } from "react";
import Logo from "../../../components/logo/logo";
import axiosInstance from "../../../components/axiosInstance";
import Alertbox from "../../../components/alertbox";
import { getCookie } from "cookies-next";
import Loader from "../../../components/logo/loader";
import Footer from "../../../components/footer";

function ExamStatistics({ myCourses, userId }) {
  let [testResults, setTestResults] = useState([]);
  let [resultPrompt, setResultPrompt] = useState(false);
  let [activeExam, setActiveExam] = useState("");
  let [loading, setLoading] = useState(false);
  let [courses, setCourses] = useState(myCourses);
  let [dupcourses, setdupCourses] = useState(myCourses);

  function findExam(e) {
    let searchCharacters = e.target.value.toLowerCase();
    let filtered = dupcourses.filter((course) =>
      course.title.toLowerCase().includes(searchCharacters)
    );
    setCourses([...filtered]);
  }

  function getStats(identifier, title) {
    setActiveExam(title);
    setLoading(true);
    axiosInstance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${getCookie("accessToken")}`;
    axiosInstance
      .post("/get_exam_statistics/" + identifier, {
        id: getCookie("id"),
      })
      .then((response) => {
        setTestResults(response.data);
        setLoading(false);
        setResultPrompt(true);
      });
  }

  return (
    <div className="bg-gray-100 font-archivo">
      {loading == true && <Loader />}
      {resultPrompt == true && (
        <div className="fixed top-0 inset-0 flex justify-center bg-gray-600 bg-opacity-40 z-30">
          <div className="mt-5 bg-white p-5 w-full md:rounded md:w-1/2 relative h-3/4">
            <div className="text-2xl text-green-600">{activeExam}</div>
            <div className="text-gray-500 mt-2">Top 10 results</div>
            {testResults.length > 0 ? (
              <div className="w-full mt-5 overflow-y-auto h-4/6">
                {testResults.map((result, index) => {
                  return (
                    <div
                      key={index}
                      className="p-2 mt-2 flex justify-between items-center bg-gray-200 text-gray-800 rounded"
                    >
                      <div className="text-gray-800 w-3/4">
                        {result.participants.userId == userId ? (
                          <div className="text-green-500 font-semibold">
                            {index + 1}. You
                          </div>
                        ) : (
                          <div>
                            {index + 1}. {result.participants.firstname}{" "}
                            {result.participants.lastname}
                          </div>
                        )}
                      </div>
                      <div className="w-1/4 text-lg flex justify-center text-green-500 font-semibold">
                        {result.participants.score}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="w-full mt-5 flex justify-center items-center h-4/6 text-gray-800">
                There are no records to fetch.
              </div>
            )}

            <div className="absolute bottom-5 right-5">
              <button
                onClick={() => setResultPrompt(false)}
                className="py-2 px-6 rounded bg-green-600 text-green-50"
              >
                Ok
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex p-5">
        <Logo />
      </div>
      <div className="flex justify-center w-full">
        <div className="md:w-1/2 w-full">
          <Alertbox message="The statistics check will return the top five scores for the selected test/exam" />
        </div>
      </div>
      <div className="flex flex-col items-center w-full">
        <div className="p-3 md:w-1/2 w-full">
          <div className="text-2xl text-green-600">Exam Statistics</div>
          <input
            type="text"
            placeholder="Search for exam.."
            className="mt-2 w-full p-2 text-sm rounded bg-gray-200 text-gray-700 focus:outline-none"
            onChange={findExam}
          />
          <div className="mt-5">
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
                    <button
                      onClick={() => getStats(course.identifier, course.title)}
                      className="w-full p-2 bg-green-600 hover:bg-green-500 rounded text-green-50"
                    >
                      Stats
                    </button>
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

export default ExamStatistics;
