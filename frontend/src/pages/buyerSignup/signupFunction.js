import axios from "axios";
import serverUrl from "../../config.js";

function enterDetails(e, setUserdetails) {
  const name = e.target.name;
  const value = e.target.value;
  setUserdetails((pre) => {
    return { ...pre, [name]: value };
  });
}

// form submit
async function submitForm( UserDetails) {
  try {
    UserDetails.password = UserDetails.password.trim();

    const userDetailsPosted = await axios.post(
      `${serverUrl}/buyerSignup`,
      UserDetails
    );

    return userDetailsPosted;
  } catch (error) {
    return error.response;
  }
}

export { enterDetails, submitForm };
