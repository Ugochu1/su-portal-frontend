import { useState } from "react";
import axiosInstance from "../axiosInstance";
import { useRouter } from "next/router";
import { getCookie, setCookies } from "cookies-next";

function CourseLister(props) {
  let router = useRouter();

  async function modify(obj) {
    axiosInstance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${getCookie("adminToken")}`;
    props.setLoading(true)
    const response = await axiosInstance.post("/modify_course", obj);
    if (response.data.message == undefined) {
      // for admins that have access
      setCookies("title", response.data.title)
      setCookies("facilitator", response.data.facilitator)
      router.push("/development-mode/courses/" + response.data.identifier + "/" + response.data.facilitator)
    } else {
      props.setModalMessage(response.data.message);
      props.setModalState(true)
    }
    props.setLoading(false)
  }

  return (
    <div className="">
      {props.details.map((courseDetail, index) => {
        const { title, facilitator, modules } = courseDetail;
        return (
          <div
            key={index}
            className="bg-gray-50 p-3 mb-1 shadow rounded-sm flex items-center"
          >
            <div className="w-2/3">
              <div className="text-gray-900 text-bold">{title}</div>
              <div className="text-gray-400 text-sm">{facilitator}</div>
            </div>
            <div className="w-1/3 flex flex-col md:flex-row items-center">
              <button
                className="p-2 m-1 text-sm border-orange-500 w-full rounded text-orange-500 border hover:bg-orange-100"
                onClick={() =>
                  modify({ id: getCookie("id"), title, facilitator })
                }
              >
                Modify
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default CourseLister;
