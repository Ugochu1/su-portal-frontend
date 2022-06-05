import Logo from "../components/logo/logo";
import { useState } from "react";
import axiosInstance from "../components/axiosInstance";
import { useRouter } from "next/router";
import Loader from "../components/logo/loader";

function ForgotPassword() {
  const router = useRouter();
  let [inputValue, setInputValue] = useState("");
  let [passwordValue, setPasswordValue] = useState("");
  let [foundAccount, setFoundAccount] = useState(false);
  let [returnedData, setReturnedData] = useState({});
  let [loading, setLoading] = useState(false);

  async function getUser(e) {
    e.preventDefault();
    setLoading(true);
    let response = await axiosInstance.post("/get_account", { inputValue });
    if (response.data != "") {
      setReturnedData(response.data);
      setFoundAccount(true);
    } else {
      alert("Your account does not exist.");
    }
    setLoading(false);
  }

  async function changePassword(e) {
    e.preventDefault();
    setLoading(true);
    let response = await axiosInstance.post("/change_password", {
      id: returnedData._id,
      password: passwordValue,
    });
    if (response.data.modifiedCount > 0) {
      alert("You have successfully updated your password");
      router.push("/login");
    } else {
      alert(
        "There was an issue updating your password. Refresh and try again."
      );
    }
    setLoading(false);
  }

  return (
    <div className="h-screen bg-gray-100 font-archivo">
      {loading == true && <Loader />}
      <div className="flex p-5">
        <Logo />
      </div>
      <div className="flex w-full justify-center">
        <div className="p-5 bg-white md:w-1/3 md:rounded md:shadow-sm w-full">
          <div className="text-2xl text-green-700">Forgot Password</div>
          <form className="mt-5" onSubmit={getUser}>
            <input
              type="text"
              placeholder="Enter registered email or phone number..."
              className="w-full bg-gray-200 p-2 rounded focus:outline-none text-gray-600"
              onChange={(e) => setInputValue(e.target.value)}
              value={inputValue}
              required
            />
            <button className="bg-green-600 p-2 rounded hover:bg-green-500 mt-3 text-green-50">
              Get Account
            </button>
          </form>
          {foundAccount == true && (
            <div className="mt-5 ">
              <div className="text-green-700 text-sm">Found Account</div>
              <div className="w-full bg-gray-200 p-3 rounded">
                <div>
                  <div className="text-green-800 text-lg">
                    {returnedData.firstname} {returnedData.lastname}
                  </div>
                  <div className="text-sm text-gray-500">
                    {returnedData.email}
                  </div>
                </div>
              </div>
            </div>
          )}
          {foundAccount == true && (
            <form className="mt-5" onSubmit={changePassword}>
              <input
                type="text"
                placeholder="Set new password"
                className="w-full bg-gray-200 p-2 rounded focus:outline-none text-gray-600"
                onChange={(e) => setPasswordValue(e.target.value)}
                value={passwordValue}
                required
              />
              <button className="bg-green-600 p-2 rounded hover:bg-green-500 mt-3 text-green-50">
                Change Password
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
