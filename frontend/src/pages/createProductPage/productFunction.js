import serverUrl from "../../config.js";
import api from "../../Axios_Interceptor/api.js";

// form submit
async function submitForm(productDetails, adminId) {
  try {
    console.log("inside pfun-", { productDetails, adminId });
    const productDetailsPosted = await api.post(`${serverUrl}/createProduct`, {
      productDetails,
      adminId,
    });

    return productDetailsPosted;
  } catch (error) {
    return error.response;
  }
}

export { submitForm };
