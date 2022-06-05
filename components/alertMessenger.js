function AlertMessenger({ message, setModalState }) {
  return (
    <div className="fixed bg-gray-600 inset-0 z-20 bg-opacity-50 flex justify-center">
      <div className="mt-10 md:w-1/3 p-5 bg-gray-50 h-48 w-full rounded shadow-md">
        <div className="text-xl mb-2">Server Message</div>
        <hr />
        <div className="text-gray-600 mt-3 text-sm">{message}</div>
        <div className="flex justify-end mt-8">
          <button className="bg-blue-600 rounded text-blue-50 shadow px-4 py-1"
          onClick={() => setModalState(false)}>Ok</button>
        </div>
      </div>
    </div>
  );
}

export default AlertMessenger;
