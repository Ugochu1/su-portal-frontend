import { useState, useEffect, useContext } from "react";
import axiosInstance from "../axiosInstance";
import { useRouter } from "next/router";
import { getCookie, setCookies } from "cookies-next";
import AppContext from "../appContext";

function MyCourseLister(props) {
  const router = useRouter();

  function delistCourse({ title, facilitator, id }) {
    axiosInstance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${getCookie("accessToken")}`;
    props.setLoading(true)
    axiosInstance.post("/course_delist", {
      id: getCookie("id"),
      title,
      facilitator,
    }).then(response => {
      if (response.data.name != undefined) {
        router.push("/login")
      } else {
        props.setLoading(false);
        if (response.data.responseArray[0].modifiedCount > 0) {
          props.setModalMessage(`You have successfully removed ${title} from your course list`)
          props.setModalState(true);
          axiosInstance.post("/decryptId", {encryptedId: getCookie("id")}).then(response_two => {
            axiosInstance.post("/send_notification", {
              message:
              `You have successfully removed ${title} from your course list`,
              receiver: [response_two.data.decryptedId],
              date: new Date(),
              read: false,
            });
          })
        }
      }
    });
  }

  return (
    <div className="">
      {props.details.map((courseDetail, index) => {
        let { title, facilitator } = courseDetail;

        return (
          <div
            key={index}
            className="bg-gray-50 p-5 mb-1 shadow rounded-sm flex items-center"
          >
            <div className="w-2/3">
              <div className="text-gray-900 text-bold">{title}</div>
              <div className="text-gray-400 text-sm">{facilitator}</div>
            </div>
            <div className="w-1/3 flex flex-col md:flex-row items-center">
              <button
                className="p-2 m-1 text-sm border-red-400 w-full rounded text-red-400 border hover:bg-red-100"
                onClick={() =>
                  delistCourse({
                    title,
                    facilitator,
                    id: getCookie("id"),
                  })
                }
              >
                Remove
              </button>
              <button
                className="p-2 m-1 text-sm border-green-500 w-full rounded text-green-500 border hover:bg-green-100"
                onClick={() => {
                  setCookies("title", title);
                  setCookies("facilitator", facilitator);
                  router.push("/live/courses/watch/");
                }}
              >
                Watch
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default MyCourseLister;
