import { BsFillEyeFill } from "react-icons/bs";
import { BsFillEyeSlashFill } from "react-icons/bs";
import { useState } from "react";

function FormText(props) {
  let { formArray, register, errors, defaultValue } = props;
  let [show, setShow] = useState(false);

  return (
    <div className="font-archivo">
      {formArray.map((form_list, index) => {
        let { label, required, type, name, placeholder } = form_list;
        if (type === "password") {
          return (
            <div id="input_container" className="px-3" key={index}>
              <label>
                <div className="text-sm mb-2 ">{label}</div>
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
                        <BsFillEyeFill scale={40} />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center mt-2 h-full p-1">
                        <BsFillEyeSlashFill scale={40} />
                      </div>
                    )}
                  </div>
                </div>
              </label>
              <div className="text-xs text-red-600">
                {errors.password?.type === "required" ? "Input password" : ""}
              </div>
            </div>
          );
        } else if (type == "textarea") {
          return (
            <div id="input_container" className="px-3 mb-4" key={index}>
              <label>
                <div className="text-sm mb-2">{label}</div>
                <div>
                  <textarea
                    className="w-full py-2 px-2 bg-gray-100 rounded focus:outline-none"
                    type={type}
                    name={name}
                    defaultValue={
                      defaultValue == ""
                        ? ""
                        : name == "title"
                        ? defaultValue.title
                        : name == "video_link"
                        ? defaultValue.video_link
                        : name == "module_text" && defaultValue.module_text
                    }
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
              <div className="text-xs text-red-600">
                {name === "email" && errors.email?.type == "pattern"
                  ? "Input valid email"
                  : ""}
                {name === "email" && errors.email?.type == "required"
                  ? "Input email"
                  : ""}
                {name === "firstname" && errors.firstname?.type == "required"
                  ? "Input First Name"
                  : ""}
                {name === "phone_number" &&
                errors.phone_number?.type == "required"
                  ? "Input Phone Number"
                  : ""}
                {name === "lastname" && errors.lastname?.type == "required"
                  ? "Input LastName"
                  : ""}
                {name === "phone_or_email" &&
                errors.phone_or_email?.type === "required"
                  ? "Input email or phone number"
                  : ""}
              </div>
            </div>
          );
        }

        return (
          <div id="input_container" className="px-3 mb-4" key={index}>
            <label>
              <div className="text-sm mb-2">{label}</div>
              <div>
                <input
                  className="w-full py-2 px-2 bg-gray-100 rounded focus:outline-none"
                  type={type}
                  name={name}
                  defaultValue={
                    defaultValue == ""
                      ? ""
                      : name == "title"
                      ? defaultValue.title
                      : name == "video_link"
                      ? defaultValue.video_link
                      : name == "module_text" && defaultValue.module_text
                  }
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
            <div className="text-xs text-red-600">
              {name === "email" && errors.email?.type == "pattern"
                ? "Input valid email"
                : ""}
              {name === "email" && errors.email?.type == "required"
                ? "Input email"
                : ""}
              {name === "firstname" && errors.firstname?.type == "required"
                ? "Input First Name"
                : ""}
              {name === "phone_number" &&
              errors.phone_number?.type == "required"
                ? "Input Phone Number"
                : ""}
              {name === "lastname" && errors.lastname?.type == "required"
                ? "Input LastName"
                : ""}
              {name === "phone_or_email" &&
              errors.phone_or_email?.type === "required"
                ? "Input email or phone number"
                : ""}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default FormText;
