import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axiosInstance from "../../../../components/axiosInstance";
import { getCookie } from "cookies-next";
import Logo from "../../../../components/logo/logo";
import ReactPlayer from "react-player/youtube";
import Footer from "../../../../components/footer";

function WatchModule() {
  const router = useRouter();
  let [moduleNumber, setModuleNumber] = useState(0);
  let [moduleArray, setModuleArray] = useState([]);
  let [numArrived, setNumArrived] = useState(false);
  let [moduleArrived, setModuleArrived] = useState(false);
  useEffect(() => {
    axiosInstance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${getCookie("accessToken")}`;
    axiosInstance
      .post("get_course", {
        title: getCookie("title"),
        facilitator: getCookie("facilitator"),
        id: getCookie("id"),
      })
      .then((response) => {
        if (response.data.name != undefined) {
          router.push("/login");
        } else {
          axiosInstance.post("/decryptId", {encryptedId: getCookie("id")}).then(response_two => {
            let {data: {decryptedId}} = response_two;
            let filtered = response.data.participants.filter(participant => participant.id == decryptedId)
            if (filtered.length > 0) {
              setModuleArray(response.data.modules);
              setModuleArrived(true);
            } else {
              router.push("/live/courses")
            }
          })
        }
      });
  }, [router]);

  useEffect(() => {
    let { module } = router.query;
    let parsedModule = parseInt(module);
    setModuleNumber(parsedModule);
    setNumArrived(true);
  }, [router.query]);

  return (
    <div className="bg-gray-100 h-screen font-archivo">
      {moduleArrived == true ? (
        numArrived == true ? (
          <div>
            <div className="p-5 flex">
              <Logo />
            </div>
            <div className="flex flex-col items-center">
              <div className="md:w-3/4 w-full bg-white p-5 flex flex-wrap">
                <div className="md:w-1/2 md:h-96 h-64 w-full p-2">
                  <ReactPlayer url={moduleArray[moduleNumber].video_link} width="100%" height="100%" controls />
                </div>
                <div className="md:w-1/2 p-3">
                  <div className="text-2xl text-gray-700 h-1/6">{moduleArray[moduleNumber].title}</div>
                  <div className=" leading-6 text-gray-500 h-5/6 overflow-y-auto text-sm">{moduleArray[moduleNumber].module_text}</div>
                </div>
              </div>
            </div>
            <div className="mt-20">
              <Footer />
            </div>
          </div>
        ) : (
          ""
        )
      ) : (
        ""
      )}
    </div>
  );
}

export default WatchModule;
