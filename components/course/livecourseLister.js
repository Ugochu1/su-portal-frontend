import { useContext } from "react";
import AppContext from "../appContext";
import axiosInstance from "../axiosInstance";
import { useRouter } from "next/router";
import { getCookie } from "cookies-next";

function LiveCourseLister(props) {
  let router = useRouter();

  function enroll(obj) {
    const reqObj = {
      ...obj,
      id: getCookie("id"),
    };

    axiosRequest(reqObj);

    function axiosRequest(obj) {
      props.setLoading(true);
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${getCookie("accessToken")}`;
      axiosInstance.post("/course_enroll", obj).then((response) => {
        if (response.data.name !== undefined) {
          router.push("/login");
        } else {
          if (response.data.responseArray[0].modifiedCount < 1) {
            props.setModalMessage("You are already enrolled in this course.");
            props.setModalState(true);
          } else {
            props.setModalMessage(
              `You have enrolled in the course: ${obj.title}`
            );
            props.setModalState(true);
            axiosInstance
              .post("/decryptId", { encryptedId: getCookie("id") })
              .then((secondres) => {
                axiosInstance.post("/send_notification", {
                  message: `You have enrolled in the course: ${obj.title}`,
                  receiver: [secondres.data.decryptedId],
                  date: new Date(),
                  read: false,
                });
              });
          }
          props.setLoading(false);
        }
      });
    }
  }

  return (
    <div className="">
      {props.details.map((courseDetail, index) => {
        const { title, facilitator, participants } = courseDetail;
        return (
          <div
            key={index}
            className="bg-gray-50 p-3 mb-1 shadow rounded-sm flex items-center"
          >
            <div className="w-2/3">
              <div className="text-gray-900 text-bold">{title}</div>
              <div className="text-gray-400 text-sm">{facilitator}</div>
              <div className="text-xs text-green-700 mt-2 flex items-center">
                <div className="h-1 w-1 rounded-full bg-green-400 mr-1"></div>
                {participants.length} participant(s)
              </div>
            </div>
            <div className="w-1/3 flex flex-col md:flex-row items-center">
              <button
                className="p-2 m-1 text-sm border-green-500 w-full rounded text-green-500 border hover:bg-green-100"
                onClick={() =>
                  enroll({
                    title,
                    facilitator,
                  })
                }
              >
                Enroll
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default LiveCourseLister;
