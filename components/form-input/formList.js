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
      name: "password",
      instructions: false
    }
  ]
}

export default formList;