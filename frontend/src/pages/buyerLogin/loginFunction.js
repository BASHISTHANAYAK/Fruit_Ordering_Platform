import api from "../../Axios_Interceptor/api.js";

function enterDetails(e, setUserdetails) {
  const name = e.target.name;
  const value = e.target.value;
  setUserdetails((pre) => {
    return { ...pre, [name]: value };
  });
}

// form submit
async function submitForm(UserDetails) {
  try {
    const payload = {
      ...UserDetails,
      password: (UserDetails.password || "").trim(),
    };

    const userDetailsPosted = await api.post("/buyerLogin", payload);
    return userDetailsPosted;
  } catch (error) {
    return error.response || error;
  }
}

export { enterDetails, submitForm };
