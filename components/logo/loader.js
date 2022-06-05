import Logo from "./logo";

function Loader() {
  return (
    <div className="font-extrabold z-10 text-4xl inset-0 w-full fixed bg-green-100 opacity-60 flex justify-center items-center">
      <div className="mr-2 animate-bounce text-green-700">
        <Logo />
      </div>
    </div>
  );
}

export default Loader;
