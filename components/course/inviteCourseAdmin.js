import { getCookie } from "cookies-next";
import { useState, useEffect } from "react";
import axiosInstance from "../axiosInstance";
import { useContext } from "react";
import AppContext from "../appContext";

function InviteCourseAdmin({
  courseData,
  setInvitationState,
  setModalMessage,
  setModalState,
  setLoading,
}) {
  let [fetched, setFetchedAdmin] = useState(false);
  let [adminList, setAdminList] = useState([]);
  let [dupadminList, setdupAdminList] = useState([]);
  let [invitedList, setInvitedList] = useState([]);
  let [dupinvitedList, setdupInvitedList] = useState([]);
  let [id, setId] = useState("");

  useEffect(() => {
    let responseArray = [];
    axiosInstance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${getCookie("adminToken")}`;
    axiosInstance
      .post("admin_list", { id: getCookie("id") })
      .then((response) => {
        response.data.forEach((admin) => {
          if (courseData.admins.includes(admin._id)) {
          } else {
            responseArray.push(admin);
          }
        });
        setAdminList(responseArray);
        setdupAdminList(responseArray);
        setFetchedAdmin(true);
        setInvitedList([]);
        setdupInvitedList([]);
      });
  }, [courseData.admins]);

  function addInvite(admin) {
    const copyAdmins = [...dupadminList];
    const index = copyAdmins.indexOf(admin);
    const invited = copyAdmins.splice(index, 1);
    setAdminList([...copyAdmins]);
    setInvitedList([...dupinvitedList, ...invited]);
    setdupAdminList([...copyAdmins]);
    setdupInvitedList([...dupinvitedList, ...invited]);
  }

  function removeInvite(admin) {
    const copyInvites = [...dupinvitedList];
    const index = copyInvites.indexOf(admin);
    const removedInvite = copyInvites.splice(index, 1);
    setInvitedList([...copyInvites]);
    setAdminList([...dupadminList, ...removedInvite]);
    setdupAdminList([...dupadminList, ...removedInvite]);
    setdupInvitedList([...copyInvites]);
  }

  function filterAdmin(e) {
    let searchCharacters = e.target.value.toLowerCase();
    let notInvited = dupadminList.filter((admin) => {
      let fullName = `${admin.firstname} ${admin.lastname}`.toLowerCase();
      return fullName.includes(searchCharacters);
    });
    let invited = dupinvitedList.filter((admin) => {
      let fullName = `${admin.firstname} ${admin.lastname}`.toLowerCase();
      return fullName.includes(searchCharacters);
    });
    setAdminList([...notInvited]);
    setInvitedList([...invited]);
  }

  async function addAdministrators() {
    let admins = [];
    dupinvitedList.forEach((invite) => {
      admins.push(invite._id);
    });

    let reqObj = {
      id: getCookie("id"),
      identifier: getCookie("title").split(" ").join("-").toLowerCase(),
      admins,
    };

    axiosInstance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${getCookie("adminToken")}`;
    setLoading(true);
    axiosInstance.post("/add_administrators", reqObj).then((response) => {
      if (response.data.modifiedCount > 0) {
        setModalMessage(
          "The selected person(s) have been added as administrators to this course."
        );
        setModalState(true);
        axiosInstance
          .post("/decryptId", {
            encryptedId: getCookie("id"),
          })
          .then((response) => {
            setId(response.data.decryptedId);
          })
          .catch((err) => {
            console.log(err);
          });
        axiosInstance.post("/send_notification", {
          message:
            "You have been added as an administrator to course: " +
            courseData.title,
          receiver: reqObj.admins,
          date: new Date(),
          read: false
        });
      }
      setInvitationState(false);
      setLoading(false);
    });
  }

  return (
    <div className="fixed inset-0 bg-gray-600 z-20 bg-opacity-40 flex justify-center">
      <div className="bg-gray-50 p-7 w-full md:w-2/5 mt-16 h-3/4 rounded shadow">
        <div className="text-2xl text-gray-800">Add Course Administrators</div>
        <div className="mt-3">
          <input
            type="text"
            placeholder="Search for Administrator"
            className="bg-gray-100 w-full p-2 rounded shadow-sm text-sm focus:outline-none"
            onChange={filterAdmin}
          />
        </div>
        {fetched == false && (
          <div className="text-gray-500 text-xs fixed">Fetching data...</div>
        )}
        <div className="h-2/3 md:h-1/2 rounded mt-2 overflow-y-auto">
          <div>
            {adminList.map((admin, index) => {
              return (
                <div
                  key={index}
                  className="bg-gray-200 p-4 text-gray-700 mt-1 rounded shadow-sm flex items-center"
                >
                  <div className="w-3/4">
                    <div>{admin.firstname + " " + admin.lastname}</div>
                    <div className="text-xs text-gray-400">{admin.email}</div>
                  </div>
                  <div className="w-1/4">
                    <button
                      className="bg-gray-600 w-full px-4 py-1 rounded shadow text-gray-50"
                      onClick={() => addInvite(admin)}
                    >
                      Add
                    </button>
                  </div>
                </div>
              );
            })}
            <div className="text-sm mt-2 text-gray-600">
              Added list - {invitedList.length}
            </div>
            {invitedList.map((admin, index) => {
              return (
                <div
                  key={index}
                  className="bg-gray-200 p-4 text-gray-700 mt-1 rounded shadow-sm flex items-center"
                >
                  <div className="w-2/3">
                    <div>{admin.firstname + " " + admin.lastname}</div>
                    <div className="text-xs text-gray-400">{admin.email}</div>
                  </div>
                  <div className="w-1/3">
                    <button
                      className="w-full bg-gray-600 px-1 text-sm md:px-4 py-1 rounded shadow text-gray-50"
                      onClick={() => removeInvite(admin)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex w-full justify-around items-center mt-5">
          <button
            className="w-1/3 px-4 py-2 bg-green-700 text-center text-green-50 rounded"
            onClick={addAdministrators}
          >
            Done
          </button>
          <button
            className="w-1/3 py-2 px-4 bg-red-400 rounded text-center text-red-50"
            onClick={() => setInvitationState(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default InviteCourseAdmin;
