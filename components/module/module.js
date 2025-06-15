import { useForm } from "react-hook-form";
import FormText from "../form-input/FormText";
import formList from "../form-input/formList";
import { useState } from "react";
import { useEffect } from "react";

function Module({ modulesArray, module_index, setChanger }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm(); // Collect everything from react-hook-form
  let [moduleNumber, setModuleNumber] = useState();
  let [showChanger, setShowChanger] = useState(false);

  const numberOfModules = modulesArray.length;

  function handleChange(index) {
    setModuleNumber(index);
    setShowChanger(true);
    setChanger(true);
  }

  function onSubmit(data) {
    console.log(data);
  }

  function getUpdates(data) {
    modulesArray[moduleNumber] = data;
    setShowChanger(false);
    setChanger(false);
  }
  

  useEffect(() => {
    setModuleNumber(module_index);
    handleChange(module_index);
  }, [module_index]);

  return (
    <div>
      {numberOfModules < 1 ? (
        <div>
          <div></div>
        </div>
      ) : (
        <div className="w-full ">
          {modulesArray.map((module_obj, index) => {
            return (
              <div key={index} className="mt-2 w-full">
                <div className="m-2 bg-gray-50 p-5 shadow rounded-lg">
                  {showChanger == true ? (
                    <div>
                      {index == moduleNumber ? (
                        <form onSubmit={handleSubmit(getUpdates)}>
                          <div className="pl-3 mb-5 text-gray-700">
                            Module {moduleNumber + 1}
                          </div>
                          <FormText
                            errors={errors}
                            register={register}
                            formArray={formList.moduleForm}
                            defaultValue=""
                          />
                          <button className="m-3 p-2 border hover:bg-green-100 border-green-400 rounded-md text-green-500">
                            Update
                          </button>
                          <button
                            className="mx-3 border border-red-300 hover:bg-red-100 rounded-md text-red-400 p-2"
                            onClick={() => {
                              setShowChanger(false);
                              setChanger(false);
                            }}
                          >
                            Cancel
                          </button>
                        </form>
                      ) : (
                        <div>
                          <p className="text-xl text-green-800">
                            {module_obj.title}
                          </p>
                          <p className="text-xs text-blue-800 mt-2 overflow-ellipsis">
                            {module_obj.video_link.substring(0, 50)}...
                          </p>
                          <p className="text-sm text-gray-700 mt-2">
                            {module_obj.module_text}
                          </p>
                          <p>{index == moduleNumber ? moduleNumber : null}</p>
                          <button
                            className="mt-2 py-2 px-4 bg-green-500 rounded-md shadow hover:bg-green-300 text-green-50"
                            onClick={() => handleChange(index)}
                          >
                            Edit
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <p className="text-xl text-green-800">
                        {module_obj.title}
                      </p>
                      <p className="text-xs text-blue-800 mt-2">
                        {module_obj.video_link.substring(0, 50)}...
                      </p>
                      <p className="text-sm text-gray-700 mt-2">
                        {module_obj.module_text}
                      </p>
                      <button
                        className="mt-2 py-2 px-4 bg-green-500 rounded-md shadow hover:bg-green-300 text-green-50"
                        onClick={() => handleChange(index)}
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Module;
