import api from "../../Axios_Interceptor/api.js";

// form submit
async function submitForm(productDetails, adminId) {
  try {
    const productDetailsPosted = await api.post("/createProduct", {
      productDetails,
      adminId,
    });
    return productDetailsPosted;
  } catch (error) {
    return error.response || error;
  }
}

export { submitForm };
