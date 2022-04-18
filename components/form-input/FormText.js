import { BsFillEyeFill } from "react-icons/bs";
import { BsFillEyeSlashFill } from "react-icons/bs";
import { useState } from "react";

function FormText(props) {
  let { formArray, register, errors } = props;
  let [show, setShow] = useState(false);

  return (
    <div className="font-fredoka">
      {formArray.map((form_list, index) => {
        let { label, required, type, name, placeholder } = form_list;
        if (type === "password") {
          return (
            <div id="input_container" className="px-3" key={index}>
              <label>
                <div className="text-sm mb-2 font-semibold">{label}</div>
                <div className="flex items-start justify-center">
                  <input
                    className="w-full py-2 px-2 bg-gray-100 rounded focus:outline-none"
                    type={show === false ? type : "text"}
                    name={name}
                    placeholder={placeholder}
                    {...register(name, {
                      required,
                      minLength: 4,
                      maxLength: 16,
                    })}
                  />
                  <div
                    onClick={() => setShow(!show)}
                    className="w-8 h-full cursor-pointer"
                  >
                    {show === false ? (
                      <div className="flex items-center justify-center mt-2 h-full p-1">
                        <BsFillEyeFill scale={40}/>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center mt-2 h-full p-1">
                        <BsFillEyeSlashFill scale={40}/>
                      </div>
                    )}
                  </div>
                </div>
              </label>
              {form_list.instructions === true
                ? "Password should be between 3 and 15 characters"
                : ""}
            </div>
          );
        }

        return (
          <div id="input_container" className="px-3 mb-4" key={index}>
            <label>
              <div className="text-sm mb-2 font-semibold">{label}</div>
              <div>
                <input
                  className="w-full py-2 px-2 mb-4 bg-gray-100 rounded focus:outline-none"
                  type={type}
                  name={name}
                  placeholder={placeholder}
                  {...register(name, {
                    required,
                    pattern:
                      name === "email"
                        ? /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g
                        : /./,
                    minLength: name === "phone" ? 10 : 1,
                    maxLength: name === "phone" ? 13 : 9999999999,
                  })}
                />
              </div>
            </label>
            {form_list.instructions === true && errors.email?.type == "pattern"
              ? "Input valid email"
              : ""}
          </div>
        );
      })}
    </div>
  );
}

export default FormText;
