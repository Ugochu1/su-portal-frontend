import { useRouter } from "next/router";

function Logo() {
  let router = useRouter();
  function takeHome() {
    router.push("/");
  }
  return (
    <div
      className="flex justify-center items-center cursor-pointer "
      onClick={takeHome}
    >
      <div>
        <img
          src="/pngkit_scripture-png_1028698.png"
          alt="SU Logo"
          width="30"
          height="30"
        />
      </div>
    </div>
  );
}

export default Logo;
