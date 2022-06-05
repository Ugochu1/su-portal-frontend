const formList = {
  Login: [
    {
      type: "text",
      placeholder: "Phone or Email",
      label: "Phone or Email",
      required: true,
      name: "phone_or_email"
    },
    {
      type: "password",
      placeholder: "Input password",
      label: "Password",
      required: true,
      name: "password"
    }
  ],
  Register: [
    {
      type: "text",
      placeholder: "First Name",
      label: "First Name",
      required: true,
      name: "firstname"
    },
    {
      type: "text",
      placeholder: "Last Name",
      label: "Last Name",
      required: true,
      name: "lastname"
    },
    {
      type: "email",
      placeholder: "Input email",
      label: "Email",
      required: true,
      name: "email"
    },
    {
      type: "text",
      placeholder: "Phone Number",
      label: "Phone Number",
      required: true,
      name: "phone_number"
    },
    {
      type: "password",
      placeholder: "Input password",
      label: "Password",
      required: true,
      name: "password"
    }
  ],
  courseInit: [
    {
      type: "text",
      placeholder: "Title",
      label: "",
      required: true,
      name: "title"
    },
    {
      type: "text",
      placeholder: "Facilitator",
      label: "",
      required: true,
      name: "facilitator"
    }
  ],
  moduleForm: [
    {
      type: "text",
      placeholder: "Title",
      label: "",
      required: true,
      name: "title"
    },
    {
      type: "text",
      placeholder: "Video link",
      label: "",
      required: true,
      name: "video_link"
    },
    {
      type: "textarea",
      placeholder: "Module Text",
      label: "",
      required: true,
      name: "module_text"
    },
  ],
  
}

export default formList;