import axiosInstance from "../../../../components/axiosInstance";
import Logo from "../../../../components/logo/logo";
import { RiMessageFill } from "react-icons/ri";
import Footer from "../../../../components/footer";
import { useRouter } from "next/router";

function CourseDisplay(props) {
  const router = useRouter();

  function goToModule(index) {
    router.push("/live/courses/watch/" + index);
  }

  function goToChat() {
    router.push("/messages/" + props.identifier)
  }

  return (
    <div className="bg-gray-100 min-h-screen font-archivo">
      <div className="p-5 flex">
        <Logo />
      </div>
      <div className="flex flex-col items-center">
        <div className="bg-gray-50 md:w-1/2 w-full p-5 rounded md:shadow-sm">
          <div className="text-3xl text-green-800">{props.title}</div>
          <div className="text-green-700">By {props.facilitator}</div>
          
        </div>
        <div className="p-5 md:w-1/2 w-full mt-5">
          <div className="text-green-800">Choose Module</div>
          <div className="mt-5">
            {props.modules.map((each_module, index) => {
              return (
                <div
                  key={index}
                  className="mt-2 p-5 bg-white rounded shadow-sm"
                >
                  <div className="text-gray-500 text-sm">
                    {each_module.title}
                  </div>
                  <div className="mt-3">
                    <button
                      onClick={() => goToModule(index)}
                      className="bg-green-600 hover:bg-green-500 px-4 py-1 text-sm rounded text-green-50"
                    >
                      Watch
                    </button>
                  </div>
                </div>
              );
            })}
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
  let { id, accessToken, title, facilitator } = context.req.cookies;
  if (id == undefined || accessToken == undefined) {
    return {
      redirect: {
        destination: "/login",
      },
    };
  }
  if (title == undefined || facilitator == undefined) {
    return {
      redirect: {
        destination: "/live/courses/mylist",
      },
    };
  }
  axiosInstance.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${accessToken}`;
  let response = await axiosInstance.post("/get_course", {
    id,
    title,
    facilitator,
  });
  if (response.data.name != undefined) {
    return {
      redirect: {
        destination: "/login",
      },
    };
  } else {
    let {
      data: { decryptedId },
    } = await axiosInstance.post("/decryptId", { encryptedId: id });
    let filtered = response.data.participants.filter(
      (participant) => participant.id == decryptedId
    );
    if (filtered.length > 0) {
      return {
        props: response.data,
      };
    } else {
      return {
        redirect: {
          destination: "/live/courses"
        }
      }
    }
  }
}

export default CourseDisplay;
