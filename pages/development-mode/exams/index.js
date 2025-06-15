import { getCookie, setCookies } from "cookies-next";
import Alertbox from "../../../components/alertbox";
import axiosInstance from "../../../components/axiosInstance";
import Footer from "../../../components/footer";
import Logo from "../../../components/logo/logo";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import AlertMessenger from "../../../components/alertMessenger";

function DevExams({ sentData }) {
  const router = useRouter();
  let [alertMessage, setAlertMessenger] = useState("");
  let [modalState, setModalState] = useState(false);
  let [data, setData] = useState(sentData)
  let [dupdata, setDupData] = useState(sentData);

  async function goToExamDev(exam) {
    let {
      data: { decryptedId },
    } = await axiosInstance.post("/decryptId", {
      encryptedId: getCookie("id"),
    });
    if (exam.creator == decryptedId) {
      // grant access
      setCookies("exam", exam.identifier);
      router.push("/development-mode/exams/" + exam.identifier);
    } else {
      let sectionAccess = exam.sections.filter(
        (section) => section.examiner == decryptedId
      );
      if (sectionAccess.length > 0) {
        // grant access
        setCookies("exam", exam.identifier);
        router.push("/development-mode/exams/" + exam.identifier);
      } else {
        // deny access
        setAlertMessenger(
          "You do not have administrative rights to this exam."
        );
        setModalState(true);
      }
    }
  }

  function filterSearch(e) {
    let searchedCharacters = e.target.value.toLowerCase();
    let filtered = dupdata.filter(exam => exam.title.toLowerCase().includes(searchedCharacters));
    setData([...filtered])
  }

  return (
    <div className="font-archivo bg-gray-100 min-h-screen">
      {modalState == true && (
        <AlertMessenger message={alertMessage} setModalState={setModalState} />
      )}
      <div className="flex p-5">
        <Logo />
      </div>
      <div className="flex items-center flex-col w-full">
        <div className="md:w-1/2 w-full">
          <Alertbox message="You are in development mode" />
        </div>
        <div className="md:w-1/2 w-full p-3 mt-3">
          <div className="text-2xl text-green-700">Exams in development</div>
          <div className="mt-2">
            <input
              type="text"
              placeholder="Search exam name..."
              onChange={filterSearch}
              className="text-sm text-gray-600 focus:outline-none p-2 w-full rounded bg-gray-200"
            />
          </div>
          {data.length > 0 ? (
            <div className="mt-5">
              {data.map((exam, index) => {
                return (
                  <div
                    key={index}
                    className="bg-gray-50 flex p-3 mt-2 rounded md:shadow-sm"
                  >
                    <div className="w-2/3 p-2">
                      <div className="text-gray-700">{exam.title}</div>
                      <div className="text-gray-500 text-xs">
                        {exam.sections.length} section(s)
                      </div>
                    </div>
                    <div className="w-1/3 p-2">
                      <button
                        onClick={() => goToExamDev(exam)}
                        className="w-full text-sm p-2 border rounded border-orange-300 text-orange-400 hover:bg-orange-100"
                      >
                        Modify
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-gray-600 h-64 mt-5 border-gray-300 bg-gray-50 flex justify-center items-center w-full border">
              There are no exams in development
            </div>
          )}
        </div>
      </div>
      <div className="mt-32">
        <Footer />
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  let { id, adminToken } = context.req.cookies;
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
  let { data } = await axiosInstance.post("/get_development_exams", { id });

  if (data.name != undefined) {
    return {
      redirect: {
        destination: "/login",
      },
    };
  } else {
    return {
      props: { sentData: data },
    };
  }
}

export default DevExams;
