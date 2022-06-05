import { useEffect, useState, useContext } from "react";
import axiosInstance from "../../../components/axiosInstance";
import Logo from "../../../components/logo/logo";
import AlertBox from "../../../components/alertbox";
import { useForm } from "react-hook-form";
import Footer from "../../../components/footer";
import { getCookie } from "cookies-next";
import { useRouter } from "next/router";
import Loader from "../../../components/logo/loader";
import AlertMessenger from "../../../components/alertMessenger";

function InitializeExam({ admins, userId }) {
  let router = useRouter();
  let [alertMessage, setAlertMessage] = useState("");
  let [modalState, setModalState] = useState(false);
  let [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  let [sections, setSections] = useState([
    { title: "", quota: "", examiner: userId, questions: [] },
  ]);
  useEffect(() => {}, []);

  function handleChange(e, index) {
    let newArr = [...sections];
    newArr[index].examiner = e.target.value;
    setSections(newArr);
  }

  function handleSectionQuota(e, index) {
    let newArr = [...sections];
    newArr[index].quota = e.target.value;
    setSections(newArr);
  }

  function handleSectionTitle(e, index) {
    let newArr = [...sections];
    newArr[index].title = e.target.value;
    setSections(newArr);
  }

  function onSubmit(data) {
    data.creator = userId;
    data.sections = sections;
    let quota = 0;
    sections.forEach((section) => {
      quota += parseFloat(section.quota);
    });
    if (quota == 1) {
      let receiver = [];
      sections.forEach((section) => {
        receiver.push(section.examiner);
      });
      setLoading(true);
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${getCookie("adminToken")}`;
      axiosInstance
        .post("/initialize_exam", { id: getCookie("id"), examObj: data })
        .then((response) => {
          if (response.data.name != undefined) {
            router.push("/login");
          } else {
            setAlertMessage(response.data.message);
            setModalState(true);
            if (response.data.message == `You have successfully initialized exam ${data.title}`){
              axiosInstance.post("/send_notification", {
                message: `The ${data.title} exam has been initialized, and you have been added as an examiner`,
                receiver,
                date: new Date(),
                read: false,
              });
            }
            setLoading(false);
          }
        });
    } else {
      alert("Total quota must be equal to 1");
    }
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
      <div className="flex justify-center">
        <div className="w-full md:w-1/2">
          <AlertBox message="You are in development mode" />
        </div>
      </div>
      <div className="flex justify-center mt-3">
        <div className="bg-gray-50 p-3 w-full md:shadow-sm md:rounded-lg md:w-3/4">
          <div className="text-2xl text-green-800 flex justify-center p-5">
            Initialize Exam
          </div>
          <div className="mt-5">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex md:flex-row flex-col justify-around w-full">
                <div className="md:w-1/3 w-full p-1">
                  <div>
                    <label>
                      <p className="text-gray-600 p-1">Exam Name: </p>
                      <input
                        type="text"
                        placeholder="Add distinguishing element, like year.."
                        {...register("title", { required: true })}
                        className="w-full rounded-lg px-2 py-1 bg-gray-200 focus:outline-none text-gray-600"
                      />
                    </label>
                  </div>
                  <div className="mt-3">
                    <label>
                      <p className="text-gray-600 p-1">Choose Duration: </p>
                      <select
                        name="duration"
                        {...register("duration", { required: true })}
                        className="form-select appearance-none
      block
      w-full
      px-3
      py-1.5
      text-base
      font-normal
      text-gray-700
      bg-white bg-clip-padding bg-no-repeat
      border border-solid border-gray-300
      rounded
      transition
      ease-in-out
      m-0
      focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                      >
                        <option value="1800000">30 minutes</option>
                        <option value="2700000">45 minutes</option>
                        <option value="3600000">1 hour</option>
                        <option value="4500000">1 hour, 15 minutes</option>
                        <option value="5400000">1 hour, 30 minutes</option>
                      </select>
                    </label>
                  </div>
                  <div className="mt-5 rounded-md p-5 border-blue-500 border text-sm text-blue-700">
                    A unique access key would be generated for the exam on
                    initialization.
                  </div>
                </div>
                <div className="md:w-1/2 flex flex-col items-center w-full p-1">
                  <div className="text-2xl text-green-700 mt-3">Sections</div>
                  <div>
                    <AlertBox message="Maximum number of sections to a course is 4. Sum of quotas must be equal to 1." />
                  </div>
                  <div className="mt-3 w-full">
                    {sections.map((section, index) => {
                      return (
                        <div
                          key={index}
                          className="p-5 w-full rounded-lg bg-white border border-gray-300 text-gray-600 mt-5"
                        >
                          <div>
                            <div className="mb-3 text-green-50 w-7 h-7 flex items-center justify-center rounded-full bg-green-600">
                              {index + 1}
                            </div>
                            <label>
                              <p>Section Title: </p>
                              <input
                                type="text"
                                onChange={(e) => handleSectionTitle(e, index)}
                                required={true}
                                className="w-full text-sm rounded-lg px-2 py-1 bg-gray-200 focus:outline-none text-gray-600"
                              />
                            </label>
                          </div>
                          <div className="mt-5">
                            <select
                              defaultValue={section.examiner}
                              onChange={(e) => handleChange(e, index)}
                              className="form-select appearance-none
      block
      w-full
      px-3
      py-1.5
      text-base
      font-normal
      text-gray-700
      bg-white bg-clip-padding bg-no-repeat
      border border-solid border-gray-300
      rounded
      transition
      ease-in-out
      m-0
      focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                            >
                              <option value={userId}>Me</option>
                              {admins.map((admin, index) => {
                                return (
                                  <option value={admin._id} key={index}>
                                    {admin.firstname + " " + admin.lastname}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                          <div className="mt-5 text-gray-600">
                            <label>
                              <p>Quota (represent with decimals):</p>
                              <input
                                type="text"
                                placeholder="Example: 0.25 for 1/4"
                                onChange={(e) => handleSectionQuota(e, index)}
                                required={true}
                                className="w-full text-sm rounded-lg px-2 py-1 bg-gray-200 focus:outline-none text-gray-600"
                              />
                            </label>
                          </div>
                          <div className="mt-5 flex justify-end">
                            {sections.length - 1 == index &&
                              sections.length < 4 && (
                                <div
                                  onClick={() =>
                                    setSections([
                                      ...sections,
                                      {
                                        title: "",
                                        quota: "",
                                        examiner: userId,
                                        questions: [],
                                      },
                                    ])
                                  }
                                  className="text-green-50 rounded p-2 bg-green-600 cursor-pointer hover:bg-green-500"
                                >
                                  Add Section
                                </div>
                              )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="flex justify-center mt-10">
                <button className="bg-gray-600 p-3 text-lg uppercase rounded text-gray-50 hover:bg-gray-400">
                  Initialize Exam
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="mt-20">
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
  let { data } = await axiosInstance.post("/admin_list", { id });
  let {
    data: { decryptedId },
  } = await axiosInstance.post("/decryptId", { encryptedId: id });
  if (data.name != undefined) {
    return {
      redirect: {
        destination: "/login",
      },
    };
  }

  return {
    props: { admins: data, userId: decryptedId },
  };
}

export default InitializeExam;
