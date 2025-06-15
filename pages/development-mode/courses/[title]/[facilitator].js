import { useRouter } from "next/router";
import { useEffect, useState, useContext } from "react";
import Alertbox from "../../../../components/alertbox";
import Logo from "../../../../components/logo/logo";
import Module from "../../../../components/module/module";
import axiosInstance from "../../../../components/axiosInstance";
import Footer from "../../../../components/footer";
import Loader from "../../../../components/logo/loader";
import { getCookie, removeCookies } from "cookies-next";
import AlertMessenger from "../../../../components/alertMessenger";
import InviteCourseAdmin from "../../../../components/course/inviteCourseAdmin";
import { BsStarFill } from "react-icons/bs";
import AppContext from "../../../../components/appContext";

function Course(props) {
  let router = useRouter();
  let [modulesArray, setModulesArray] = useState([]);
  let [index, setIndex] = useState(null);
  let [userData, setUserData] = useState({});
  let [admins, setAdmins] = useState([]);
  let [loading, setLoading] = useState(false);
  let [changer, setChanger] = useState(false);
  let [modalMessage, setModalMessage] = useState("");
  let [modalState, setModalState] = useState(false);
  let [invitationState, setInvitationState] = useState(false);

  useEffect(() => {
    async function getProgress(obj) {
      setLoading(true);
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${getCookie("adminToken")}`;
      const response = await axiosInstance.post("/modify_course", obj);
      if (response.data.name != undefined) {
        router.push("/login");
      } else {
        let info = await axiosInstance.post("/decryptId", {
          encryptedId: getCookie("id"),
        });
        if (response.data.admins.includes(info.data.decryptedId)) {
          let responseArray = [];
          axiosInstance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${getCookie("adminToken")}`;
          axiosInstance
            .post("admin_list", { id: getCookie("id") })
            .then((response_two) => {
              response_two.data.forEach((admin) => {
                if (response.data.admins.includes(admin._id)) {
                  responseArray.push(admin);
                  setAdmins(responseArray);
                }
              });
            });
          setUserData(response.data);
          setModulesArray(response.data.modules);
          setLoading(false);
        } else {
          router.push("/development-mode/courses");
        }
      }
    }
    let obj = {
      id: getCookie("id"),
      title: getCookie("title"),
      facilitator: getCookie("facilitator"),
    };
    getProgress(obj);
  }, [router]);

  function pushInvite() {
    setInvitationState(true);
  }

  function saveRequest(obj) {
    setLoading(true);
    axiosInstance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${getCookie("adminToken")}`;
    console.log(obj);
    axiosInstance.post("/update_course", obj).then((response) => {
      if (response.data.name !== undefined) {
        router.push("/login");
      } else {
        setModalMessage(response.data.message);
        setModalState(true);
        setLoading(false);
      }
    });
  }

  function deployRequest(obj) {
    setLoading(true);

    axiosInstance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${getCookie("adminToken")}`;
    axiosInstance
      .post("/deploy_course", obj)
      .then((response) => {
        if (response.data.name != undefined) {
          router.push("/login");
        } else {
          axiosInstance.post("/send_notification", {
            message:
              "The team has successfully deployed course: " + userData.title,
            receiver: userData.admins,
            date: new Date(),
            read: false,
          });
          setModalMessage(response.data.message);
          setModalState(true);
          setLoading(false);
          router.push("/development-mode/courses");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function addToArray() {
    setModulesArray([
      ...modulesArray,
      { title: "", video_link: "", module_text: "" },
    ]);
    setIndex(modulesArray.length);
  }

  function saveData() {
    userData.id = getCookie("id");
    userData.modules = modulesArray;
    saveRequest(userData);
  }

  function deployCourse() {
    const deployObj = {
      id: getCookie("id"),
      title: userData.title,
      facilitator: userData.facilitator,
    };
    deployRequest(deployObj);
  }

  return (
    <>
      <div className="min-h-screen bg-gray-100 font-archivo">
        {invitationState == true && (
          <InviteCourseAdmin
            courseData={userData}
            setInvitationState={setInvitationState}
            setModalMessage={setModalMessage}
            setModalState={setModalState}
            setLoading={setLoading}
          />
        )}
        {modalState == true && (
          <AlertMessenger
            message={modalMessage}
            setModalState={setModalState}
          />
        )}
        {loading == true && <Loader />}
        <div className="flex p-5">
          <Logo />
        </div>
        <div className="w-full flex flex-col items-center">
          <div className="md:w-1/2 w-full sticky z-10">
            <Alertbox message="You are in development mode" />
          </div>
          <div className="flex items-center flex-wrap">
            <div className="text-green-800 flex justify-start font-medium px-5 text-2xl">
              {userData.title}
            </div>
            <div>
              {modulesArray.length < 4 ? (
                <button
                  className="bg-gray-400 ml-5 py-1 px-5 rounded-md text-gray-50 hover:bg-gray-300 hover:text-gray-50"
                  onClick={addToArray}
                >
                  Add Module
                </button>
              ) : (
                ""
              )}
            </div>
          </div>
          <div className="md:w-1/3 w-full bg-white p-3 md:rounded-xl shadow mt-3">
            <div className="text-gray-500">
              <div className="flex items-center ">
                <div className="mr-2 font-sans tracking-tighter font-semibold">
                  {admins.length > 0 ? "Other" : "There are no other"} admins
                </div>{" "}
                <BsStarFill />{" "}
              </div>
            </div>
            {admins.map((admin, index) => {
              return (
                <div
                  key={index}
                  className="p-2 bg-gray-100 mt-2 rounded-lg shadow-sm"
                >
                  <div className="flex items-center">
                    <div className="mr-1 text-sm text-gray-600">
                      {admin.firstname + " " + admin.lastname}
                    </div>
                    <div className="w-1 h-1 rounded-full bg-gray-500"></div>
                    <div className="text-xs ml-1 text-gray-400">
                      {admin.email}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="w-full md:w-5/12 mt-3">
            <Module
              modulesArray={modulesArray}
              module_index={index}
              setChanger={setChanger}
            />
          </div>

          <div className="mt-8 w-1/2 flex flex-wrap justify-center">
            <button
              className="m-1 p-2 bg-gray-600 w-full md:w-1/3 rounded-lg text-gray-50"
              onClick={saveData}
            >
              Save
            </button>
            <button
              className="m-1 p-2 bg-gray-500 w-full md:w-1/3 rounded-lg text-gray-50"
              disabled={
                modulesArray.length < 1
                  ? changer == true
                    ? true
                    : true
                  : false
              }
              onClick={deployCourse}
            >
              Deploy
            </button>
            <button
              className="m-1 p-2 bg-gray-400 w-full md:w-1/3 rounded-lg text-gray-50"
              onClick={pushInvite}
            >
              Add Administrators
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

// export async function getServerSideProps(context) {
//   const { id, adminToken, title, facilitator } = context.req.cookies;

//   if (id == undefined || adminToken == undefined) {
//     return {
//       redirect: {
//         destination: "/login",
//       },
//     };
//   }

//   if (title == undefined || facilitator == undefined) {
//     return {
//       redirect: {
//         destination: "/development-mode/courses",
//       },
//     };
//   }

//   axiosInstance.defaults.headers.common[
//     "Authorization"
//   ] = `Bearer ${adminToken}`;
//   const response = await axiosInstance.post("/modify_course", {
//     id,
//     title,
//     facilitator,
//   });
//   if (response.data.name != undefined) {
//     return {
//       redirect: {
//         destination: "/login",
//       },
//     };
//   } else {
//     return {
//       props: response.data,
//     };
//   }
// }

export default Course;
