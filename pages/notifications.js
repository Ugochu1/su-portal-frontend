import axiosInstance from "../components/axiosInstance";
import Footer from "../components/footer";
import Logo from "../components/logo/logo";

function Notifications({ data }) {

  return (
    <div className="bg-gray-100 font-archivo">
      <div className="p-5 flex">
        <Logo />
      </div>
      <div className="w-full flex flex-col items-center">
        <div className="flex md:w-1/2 text-2xl text-green-700">
          Notifications
        </div>
        <div className="p-3 md:w-1/2 w-full mt-5">
          {data.length > 0 ? (
            data.map((eachNotification, key) => {
              return (
                <div
                  key={key}
                  className="p-5 rounded-md bg-gray-50 mt-3 border-gray-400 border shadow-sm"
                >
                  <div className="text-gray-600 text-sm">
                    {eachNotification.message}
                  </div>
                  <div className="text-xs mt-3 text-gray-500">
                    Received:{" "}
                    {new Date(eachNotification.date).getHours() +
                      ":" +
                      new Date(eachNotification.date).getMinutes() +
                      ", " +
                      new Date(eachNotification.date).toDateString()}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-gray-600 h-72 w-full bg-white mt-3 border-gray-400 border shadow-sm flex items-center justify-center">
              You do not have any notifications.
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
  let { id, accessToken } = context.req.cookies;
  if (id == undefined || accessToken == undefined) {
    return {
      redirect: {
        destination: "/login",
      },
    };
  }
  axiosInstance.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${accessToken}`;
  let response = await axiosInstance.post("/get_notifications", { id });
  if (response.data.name != undefined) {
    
  }

  return {
    props: { data: response.data },
  };
}

export default Notifications;
