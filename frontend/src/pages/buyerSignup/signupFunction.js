import serverUrl from "../../config.js";
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
    UserDetails.password = UserDetails.password.trim();

    const userDetailsPosted = await api.post(
      `${serverUrl}/buyerSignup`,
      UserDetails
    );

    return userDetailsPosted;
  } catch (error) {
    return error.response;
  }
}

export { enterDetails, submitForm };
