import Alertbox from "../../../components/alertbox";
import axiosInstance from "../../../components/axiosInstance";
import Logo from "../../../components/logo/logo";
import { useState, useEffect } from "react";
import Footer from "../../../components/footer";
import { getCookie } from "cookies-next";
import Loader from "../../../components/logo/loader";
import AlertMessenger from "../../../components/alertMessenger";
import { FaCrown } from "react-icons/fa";
import { useRouter } from "next/router";

function ModifyExam({ exam, userId }) {
  const router = useRouter();
  let [editing, setEditing] = useState(false);
  let [sections, setSections] = useState([...exam.sections]);
  let [activeTab, setActiveTab] = useState({});
  let [loading, setLoading] = useState(false);
  let [alertMessage, setAlertMessage] = useState("");
  let [modalState, setModalState] = useState(false);

  function modifySection(index) {
    setActiveTab(sections[index]);
    setEditing(true);
  }

  function addQuestion() {
    let tabClone = activeTab;
    tabClone.questions.push({ question: "", options: "", answer: "" });
    setActiveTab({ ...tabClone });
  }

  function handleQuestion(e, index) {
    let tabClone = activeTab;
    tabClone.questions[index].question = e.target.value;
    setActiveTab({ ...tabClone });
  }

  function handleOptions(e, index) {
    let tabClone = activeTab;
    tabClone.questions[index].options = e.target.value;
    setActiveTab({ ...tabClone });
  }

  function handleAnswer(e, index) {
    let tabClone = activeTab;
    tabClone.questions[index].answer = e.target.value;
    setActiveTab({ ...tabClone });
  }

  function saveSection() {
    setLoading(true);
    axiosInstance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${getCookie("adminToken")}`;
    axiosInstance
      .post(`/update_exam_section/${exam.identifier}/${activeTab.title}`, {
        id: getCookie("id"),
        data: activeTab.questions,
      })
      .then((response) => {
        if (response.data.modifiedCount > 0) {
          setAlertMessage(
            `Section "${activeTab.title}" of ${exam.title} updated successfully`
          );
          setModalState(true);
        } else {
          setAlertMessage(`Nothing new to update`);
          setModalState(true);
        }
        setLoading(false);
      });
  }

  function deployExam() {
    setLoading(true);
    axiosInstance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${getCookie("adminToken")}`;
    axiosInstance
      .post("/deploy_exam", {
        id: getCookie("id"),
        identifier: exam.identifier,
      })
      .then((response) => {
        if (response.data.modifiedCount > 0) {
          setAlertMessage(
            `You have successfully deployed the "${exam.title}" exam. Please wait, while you are redirected.`
          );
          setModalState(true);
          setTimeout(() => {
            router.push("/development-mode/exams");
          }, 5000);
        } else {
          setAlertMessage(`Exam is already deployed.`);
          setModalState(true);
        }
      });
  }

  return (
    <div className="bg-gray-100 font-archivo">
      {loading == true && <Loader />}
      {modalState == true && (
        <AlertMessenger message={alertMessage} setModalState={setModalState} />
      )}
      <div className="flex p-5">
        <Logo />
      </div>
      <div className="flex flex-col items-center">
        <div className="md:w-1/2 w-full">
          <Alertbox message="You are in development mode." />
        </div>
        <div className="text-3xl mt-3 text-green-700 pl-3">{exam.title}</div>
        {editing == false ? (
          <div
            className={"p-3 md:w-2/3 w-full flex flex-wrap justify-center mt-5"}
          >
            {sections.map((section, index) => {
              return (
                <div
                  key={index}
                  className="m-1 bg-white md:w-1/3 w-full p-8 relative md:rounded-lg md:shadow-sm"
                >
                  <div className="text-lg text-green-700">{section.title}</div>
                  <div className="text-xs mt-2 text-gray-500">
                    Quota (out of 1): <strong>{section.quota}</strong>
                  </div>
                  <div className="text-sm text-gray-500 mt-2">
                    Currently with {section.questions.length} question(s)
                  </div>
                  {userId == section.examiner && (
                    <div className="absolute py-0.5 top-2 text-xs rounded-full text-green-500 border border-green-300 bg-green-100 px-3 right-2">
                      Access
                    </div>
                  )}
                  <div className="mt-7 w-full">
                    <button
                      disabled={userId != section.examiner ? true : false}
                      onClick={() => modifySection(index)}
                      className={
                        userId != section.examiner
                          ? "w-full bg-gray-300 p-2 text-gray-700 rounded"
                          : "hover:bg-green-500 w-full bg-green-600 p-2 rounded text-green-50"
                      }
                    >
                      Modify
                    </button>
                  </div>
                </div>
              );
            })}
            {exam.creator == userId && (
              <div className="flex w-full flex-col items-center mt-20">
                <div className="flex items-center text-gray-500">
                  Exclusive to Creator{" "}
                  <div className="ml-2">
                    <FaCrown />
                  </div>
                </div>
                <div className="md:w-1/2 p-3 bg-white rounded shadow w-full flex justify-around items-center mt-2">
                  <div className="w-1/2 m-1 flex flex-col items-center">
                    <div className="text-gray-500">Access Key</div>
                    <div className="text-green-500 font-bold text-4xl">
                      {exam.accessKey}
                    </div>
                  </div>
                  <button
                    onClick={deployExam}
                    className="w-1/2 m-1 p-3 bg-green-600 rounded hover:bg-green-400 text-green-50"
                  >
                    Deploy Exam
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-3 md:w-2/3 w-full flex flex-col items-center mt-5">
            {/* you are working with the active tab here */}
            <div className="flex items-center justify-between border border-gray-300 w-full md:w-2/3 bg-white p-2 rounded-lg">
              <div>
                <div className="text-xs text-gray-400">Section</div>
                <div className="text-md text-gray-800">{activeTab.title}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Quota</div>
                <div className="text-md text-gray-800">{activeTab.quota}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Questions</div>
                <div className="text-md text-gray-800">
                  {activeTab.questions.length}/15
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Examiner</div>
                <div className="text-md text-gray-800">You</div>
              </div>
            </div>
            <div className="mt-5">
              <button
                onClick={() => setEditing(false)}
                className="bg-red-100 border-red-300 text-red-500 hover:bg-red-200 border h-8 w-8 rounded-full flex items-center justify-center"
              >
                &times;
              </button>
            </div>
            <div className="p-1 mt-1 w-full md:w-2/3">
              {activeTab.questions.map((question, index) => {
                return (
                  <div
                    key={index}
                    className="p-5 bg-white mt-5 rounded-lg border border-gray-300 shadow-sm w-full"
                  >
                    <div className="h-7 w-7 text-sm text-white bg-gray-500 flex justify-center items-center rounded-full">
                      {index + 1}
                    </div>
                    <div className="mt-2">
                      <label>
                        <p className="text-gray-600">Question:</p>
                        <textarea
                          defaultValue={question.question}
                          className="w-full bg-gray-100 rounded focus:outline-none p-2 text-gray-700"
                          onChange={(e) => handleQuestion(e, index)}
                        />
                      </label>
                    </div>
                    <div className="mt-2">
                      <label>
                        <p className="text-gray-600">Options:</p>
                        <input
                          type="text"
                          defaultValue={question.options}
                          className="w-full bg-gray-100 rounded focus:outline-none p-2 text-gray-700"
                          onChange={(e) => handleOptions(e, index)}
                        />
                      </label>
                      <div className="text-xs text-red-500">
                        Options should be seperated by a comma and a space only.
                        Example: Jesus, Mary, Peter
                      </div>
                    </div>
                    <div className="mt-2">
                      <label>
                        <p className="text-gray-600">Answer:</p>
                        <input
                          type="text"
                          defaultValue={question.answer}
                          className="w-full bg-gray-100 rounded focus:outline-none p-2 text-gray-700"
                          onChange={(e) => handleAnswer(e, index)}
                        />
                      </label>
                      <div className="text-xs text-red-500">
                        Answer must be a included in the options
                      </div>
                    </div>
                  </div>
                );
              })}
              <div className="flex w-full justify-end mt-5">
                {activeTab.questions.length < 15 && (
                  <button
                    onClick={addQuestion}
                    className="p-2 bg-green-500 hover:bg-green-300 rounded text-green-50"
                  >
                    Add Question
                  </button>
                )}
              </div>
              <div className="w-full mt-10">
                <button
                  onClick={saveSection}
                  className="w-full p-3 bg-green-600 rounded-lg text-xl text-green-50 hover:bg-green-500"
                >
                  Save Section
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-32">
        <Footer />
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  let { id, exam, adminToken } = context.req.cookies;
  if (id == undefined || adminToken == undefined) {
    return {
      redirect: {
        destination: "/login",
      },
    };
  }
  if (exam == undefined) {
    return {
      redirect: {
        destination: "/development-mode/exams"
      }
    }
  }

  axiosInstance.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${adminToken}`;
  let { data } = await axiosInstance.post("/get_development_exam/" + exam, {
    id,
  });
  let {
    data: { decryptedId },
  } = await axiosInstance.post("/decryptId", { encryptedId: id });

  if (data.name != undefined) {
    return {
      redirect: {
        destination: "/login",
      },
    };
  } else {
    return {
      props: { exam: data, userId: decryptedId },
    };
  }
}

export default ModifyExam;
