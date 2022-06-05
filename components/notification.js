import { useRouter } from "next/router";

function NotificationPopup(props) {
  const router = useRouter();

  return (
    <div className="flex justify-center fixed w-full z-30 h-40 font-archivo">
      <div className="p-3 bg-white w-full md:w-1/3 shadow rounded mt-3 relative">
        <div className="h-3/4 overflow-y-auto">
          <div className="p-5 text-sm text-gray-700">{props.message}</div>
        </div>
        <div className="h-1/4 flex justify-center">
          <button
            onClick={() => {router.push("/notifications"); props.setShowNotification(false)}}
            className="h-full bg-green-600 text-green-50 flex justify-center rounded items-center w-1/2 shadow-sm"
          >
            All Notifications
          </button>
        </div>
        <button
          className="absolute top-0 right-2 text-lg"
          onClick={() => props.setShowNotification(false)}
        >
          &times;
        </button>
      </div>
    </div>
  );
}

export default NotificationPopup;
