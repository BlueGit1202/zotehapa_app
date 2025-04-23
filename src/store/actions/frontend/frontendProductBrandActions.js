import axios from "axios";
import appService from "../../../../services/appService";

export const fetchBrands = (payload = {}) => async dispatch => {
  try {
    dispatch({ type: "FETCH_BRANDS_REQUEST" });
    let url = "frontend/product-brand";
    if (payload) url += appService.requestHandler(payload);
    const res = await axios.get(url);
    if (typeof payload.vuex === "undefined" || payload.vuex === true) {
      dispatch({ type: "FETCH_BRANDS_SUCCESS", payload: res.data.data });
    }
    return res.data;
  } catch (error) {
    dispatch({ type: "BRAND_FAILURE", payload: error.message });
    throw error;
  }
};
