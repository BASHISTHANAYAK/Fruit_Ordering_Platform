import axios from "axios";
import serverUrl from "../../config.js";

function enterDetails(e, setUserdetails) {
  // accessing which input tag we are filling
  const name = e.target.name;
  // accessing the entered value of inputs tag
  const value = e.target.value;
  setUserdetails((pre) => {
    return { ...pre, [name]: value };
  });
}

// form submit
async function submitForm(event, UserDetails) {
  event.preventDefault();
  try {
    UserDetails.password = UserDetails.password.trim();

    const userDetailsPosted = await axios.post(
      `${serverUrl}/login`,
      UserDetails
    );

    return userDetailsPosted.data;
  } catch (error) {
    return error.response.data;
  }
}

export { enterDetails, submitForm };
