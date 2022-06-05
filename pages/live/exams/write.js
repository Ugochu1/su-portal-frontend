import axiosInstance from "../../../components/axiosInstance";
import { useState, useEffect, useMemo } from "react";
import { getCookie, removeCookies } from "cookies-next";
import Countdown from "react-countdown";
import Footer from "../../../components/footer";
import { useRouter } from "next/router";

function WriteExam({ exam, write_exam, userId, firstname, lastname }) {
  let router = useRouter();
  let [activeTab, setActiveTab] = useState(0);
  let [activeQuestion, setActiveQuestion] = useState(0);
  let [sections, setSections] = useState([...exam.sections]);
  let [examStarted, setExamStarted] = useState(false);
  let [examSubmitted, setExamSubmitted] = useState(false);
  let [answeredQuestions, setAnsweredQuestions] = useState([]);
  let [score, setScore] = useState("Calculating...");
  let [submittedStatus, setSubmittedStatus] = useState("Pending");
  let [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    if (examSubmitted == true) {
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${getCookie("accessToken")}`;
      axiosInstance
        .post("/get_live_exam_withAnswers/" + write_exam, {
          id: getCookie("id"),
        })
        .then((response) => {
          let { sections } = response.data;
          let my_sections = exam.sections;
          let results = [];

          for (var i = 0; i < sections.length; i++) {
            let sectionScore = 0;
            let sectionQuota = parseFloat(sections[i].quota);
            for (var j = 0; j < sections[i].questions.length; j++) {
              if (
                my_sections[i].questions[j].question ==
                  sections[i].questions[j].question &&
                my_sections[i].questions[j].answer ==
                  sections[i].questions[j].answer
              ) {
                sectionScore++;
              }
            }
            results.push(
              (sectionScore / sections[i].questions.length) * sectionQuota
            );
          }
          setTimeout(() => {
            var result =
              100 * results.reduce((previous, current) => previous + current);
            axiosInstance
              .post("/submit_exam/" + write_exam, {
                id: getCookie("id"),
                details: {
                  userId,
                  firstname,
                  lastname,
                  score: result,
                },
              })
              .then((response) => {
                if (response.data.modifiedCount > 0) {
                  setScore(result.toString() + "%");
                  setSubmittedStatus("Submitted");
                }
              });
          }, 3000);
        });
    }
  }, [examSubmitted, exam.sections, write_exam, firstname, lastname, userId]);

  let timer = useMemo(
    () => (
      <Countdown
        date={Date.now() + parseInt(exam.duration)}
        onComplete={() => {
          setExamSubmitted(true);
        }}
      />
    ),
    [exam.duration]
  );

  let questions = useMemo(() => {
    function handleQuestion(e, sectionIndex, questionIndex) {
      let si = sectionIndex.toString();
      let qi = questionIndex.toString();
      exam.sections[sectionIndex].questions[questionIndex].answer =
        e.target.value;
      setAnsweredQuestions([...answeredQuestions, si + qi]);
    }
    return (
      <div>
        {sections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            <div className={sectionIndex == activeTab ? "" : "hidden"}>
              {section.questions.map((question, questionIndex) => (
                <div key={questionIndex}>
                  <div
                    className={questionIndex == activeQuestion ? "" : "hidden"}
                  >
                    <div className="text-2xl text-gray-700">
                      {questionIndex + 1}. {question.question}
                    </div>
                    <div className="mt-5 flex flex-col">
                      {question.options
                        .split(", ")
                        .map((option, optionIndex) => (
                          <label
                            onChange={(e) =>
                              handleQuestion(e, sectionIndex, questionIndex)
                            }
                            key={optionIndex}
                            className="text-lg text-gray-600 flex items-center cursor-pointer mt-2"
                          >
                            <input
                              type="radio"
                              name={section.title + questionIndex}
                              className="mr-3"
                              value={option}
                            />{" "}
                            {option}
                          </label>
                        ))}
                    </div>
                  </div>
                </div>
              ))}
              <div className="w-full md:w-1/2 mt-7 flex justify-between items-center">
                {activeQuestion > 0 && (
                  <button
                    onClick={() => setActiveQuestion(activeQuestion - 1)}
                    className="py-2 px-4 rounded text-green-800 border bg-green-200"
                  >
                    Prev
                  </button>
                )}
                {section.questions.length - 1 > activeQuestion && (
                  <button
                    onClick={() => setActiveQuestion(activeQuestion + 1)}
                    className="py-2 px-4 rounded text-green-50 border bg-green-600"
                  >
                    Next
                  </button>
                )}
              </div>
              <div className="flex flex-wrap mt-10 w-full">
                {section.questions.map((q, num) => {
                  return (
                    <button
                      key={num}
                      onClick={() => setActiveQuestion(num)}
                      className={
                        answeredQuestions.includes(
                          sectionIndex.toString() + num.toString()
                        ) == true
                          ? "py-2 px-4 mr-1 bg-green-500 border text-white border-green-300 mt-3 rounded hover:bg-green-400"
                          : "py-2 px-4 mr-1 bg-gray-100 border border-gray-300 mt-3 rounded hover:bg-gray-200"
                      }
                    >
                      {num + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }, [activeQuestion, activeTab, sections, answeredQuestions, exam.sections]);

  useEffect(() => () => removeCookies("write_exam"));
  return (
    <div>
      {showPrompt == true && (
        <div className="fixed top-0 inset-0 bg-gray-700 z-30 flex justify-center bg-opacity-30 font-archivo">
          <div className="mt-7 p-5 bg-white w-full md:w-1/3 h-40 rounded">
            <div className="text-2xl text-red-600">Submit?</div>
            <div className="mt-2 text-gray-600">
              Are you sure you want to submit this exam
            </div>
            <div className="flex mt-5 justify-between items-center">
              <button
                onClick={() => setShowPrompt(false)}
                className="w-1/3 bg-red-500 hover:bg-red-400 text-red-50 p-2 rounded"
              >
                No
              </button>
              <button
                onClick={() => {
                  setExamSubmitted(true);
                  setShowPrompt(false);
                }}
                className="w-1/3 hover:bg-green-500 bg-green-600 text-green-50 p-2 rounded"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
      {examSubmitted == true ? (
        <div className="font-archivo bg-gray-100 h-screen">
          <div className="flex flex-wrap p-5 items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">
                &copy; Scripture Union Exams
              </div>
              <div className="text-2xl text-green-600">{exam.title}</div>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="p-5 bg-white w-full md:w-1/3 mt-5 md:rounded shadow">
              <div className="text-3xl text-green-700">
                <div>Report</div>
              </div>
              <div className="flex mt-3">
                <div className="mr-1 text-gray-500">Status:</div>
                <div
                  className={
                    submittedStatus == "Pending"
                      ? "text-orange-300"
                      : submittedStatus == "Submitted" && ""
                  }
                >
                  {submittedStatus}
                </div>
              </div>
              <div className="flex flex-col items-center justify-center mt-5">
                <div className="text-gray-900 mb-2">Your Score:</div>
                <div
                  className={
                    score == "Calculating..."
                      ? ""
                      : "text-6xl text-green-600 font-semibold"
                  }
                >
                  {score}
                </div>
                <div className="p-3 w-full text-center bg-blue-100 text-blue-700 rounded shadow-sm mt-5">
                  Do not share the access key with anybody.
                </div>
                {submittedStatus == "Submitted" && (
                  <div className="text-gray-500 mt-8">
                    You will be logged out in{" "}
                    <Countdown
                      date={Date.now() + 10000}
                      onComplete={() => {
                        removeCookies("id");
                        removeCookies("accessToken");
                        removeCookies("adminToken");
                        removeCookies("exam");
                        removeCookies("write_exam");
                        router.push("/login");
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-100 h-screen font-archivo">
          <div className="flex flex-wrap p-5 items-center justify-between border-b border-gray-300 shadow-sm">
            <div>
              <div className="text-sm text-gray-600">
                &copy; Scripture Union Exams
              </div>
              <div className="text-2xl text-green-600">{exam.title}</div>
            </div>
            <div className="mt-2 flex flex-col items-center">
              <div className="fixed bottom-6 right-3 border border-gray-600 text-xl rounded-full bg-white p-3">
                <div>{timer}</div>
              </div>
              <div className="text-gray-600">
                {examStarted == false ? (
                  <button
                    onClick={() => setExamStarted(true)}
                    className="p-2 bg-green-600 rounded hover:bg-green-400 text-green-50 text-sm"
                  >
                    Start Exam
                  </button>
                ) : (
                  <button
                    onClick={() => setShowPrompt(true)}
                    className="p-2 bg-green-600 rounded hover:bg-green-400 text-green-50 text-sm"
                  >
                    Submit Exam
                  </button>
                )}
              </div>
            </div>
          </div>
          {examStarted == false && (
            <div className="w-full bg-white p-5 h-4/6 border-b border-gray-300 flex items-center justify-center">
              <div>
                <div className="text-4xl text-gray-500">Instructions</div>
                <div className="md:w-1/2 leading-8 mt-5 text-gray-600">
                  Your time has started. Exam duration is{" "}
                  {exam.duration == "1800000"
                    ? "30 minutes"
                    : exam.duration == "2700000"
                    ? "45 minutes"
                    : exam.duration == "3600000"
                    ? "1 hour"
                    : exam.duration == "4500000"
                    ? "1 hour 15 minutes"
                    : exam.duration == "5400000" && "1 hour 30 minutes"}
                  . Please click on the {"'Start Exam'"} button at the top of
                  the screen to begin your exam. There is a timer on the bottom
                  right of the screen to help you keep track of time. Goodluck!
                </div>
              </div>
            </div>
          )}
          {examStarted == true && (
            <div className="w-full bg-white md:h-4/6 md:flex border-b border-gray-300 md:overflow-y-auto">
              <div className="md:w-1/5 w-full flex flex-col justify-center md:border-r p-5 border-gray-300">
                {sections.map((section, index) => {
                  return (
                    <div
                      key={index}
                      onClick={() => {
                        setActiveTab(index);
                        setActiveQuestion(0);
                      }}
                      className={
                        index == activeTab
                          ? "w-full p-2 rounded-lg text-center text-green-50 bg-green-500 mb-2 border border-green-400"
                          : "w-full p-2 rounded-lg text-center text-gray-600 mb-2 border border-gray-400 cursor-pointer hover:bg-gray-100"
                      }
                    >
                      {section.title}
                    </div>
                  );
                })}
              </div>
              <div className="md:p-10 p-5 md:w-4/5">{questions}</div>
            </div>
          )}
          <div className="mt-32">
            <Footer />
          </div>
        </div>
      )}
    </div>
  );
}

export async function getServerSideProps(context) {
  let { id, write_exam, accessToken } = context.req.cookies;
  if (write_exam == undefined) {
    return {
      redirect: {
        destination: "/live/exams",
      },
    };
  }
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

  let response = await axiosInstance.post("/decryptId", { encryptedId: id });
  let dashboardresponse = await axiosInstance.post("/dashboard", { id });

  let firstname = dashboardresponse.data.firstname;
  let lastname = dashboardresponse.data.lastname;

  let { data } = await axiosInstance.post("/get_live_exam/" + write_exam, {
    id,
  });
  if (data.name != undefined) {
    return {
      redirect: {
        destination: "/login",
      },
    };
  } else {
    return {
      props: {
        exam: data,
        write_exam,
        userId: response.data.decryptedId,
        firstname,
        lastname,
      },
    };
  }
}

export default WriteExam;
