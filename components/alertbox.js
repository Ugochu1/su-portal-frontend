function Alertbox(props) {
  return (
    <div id="input_container" className="px-3 mb-4">
      <div className="text-sm text-orange-900 font-archivo font-extralight text-center border-2 border-orange-500 rounded-md bg-orange-200 opacity-75 w-full mt-4 p-2">
        {props.message}
      </div>
    </div>
  );
}

export default Alertbox;
