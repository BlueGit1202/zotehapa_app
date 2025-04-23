import axios from "axios";
import appService from "../../../../services/appService";

export const fetchProductSections = (payload = {}) => async dispatch => {
  try {
    dispatch({ type: "SECTION_REQUEST" });
    let url = "frontend/product-section";
    if (payload) url += appService.requestHandler(payload);
    const res = await axios.get(url);
    dispatch({ type: "FETCH_SECTIONS_SUCCESS", payload: res.data.data });
    return res.data;
  } catch (error) {
    dispatch({ type: "SECTION_FAILURE", payload: error.message });
    throw error;
  }
};

export const fetchSection = id => async dispatch => {
  try {
    dispatch({ type: "SECTION_REQUEST" });
    const res = await axios.get(`frontend/product-section/show/${id}`);
    dispatch({ type: "FETCH_SECTION_SUCCESS", payload: res.data.data });
    return res.data;
  } catch (error) {
    dispatch({ type: "SECTION_FAILURE", payload: error.message });
    throw error;
  }
};

export const fetchSectionProducts = (slug, payload = {}) => async dispatch => {
  try {
    dispatch({ type: "SECTION_REQUEST" });
    let url = `frontend/product-section/products/${slug}`;
    if (payload) url += appService.requestHandler(payload);
    const res = await axios.get(url);
    if (typeof payload.vuex === "undefined" || payload.vuex === true) {
      dispatch({
        type: "FETCH_SECTION_PRODUCTS_SUCCESS",
        payload: {
          products: res.data.data,
          page: res.data.meta,
          pagination: res.data
        }
      });
    }
    return res.data;
  } catch (error) {
    dispatch({ type: "SECTION_FAILURE", payload: error.message });
    throw error;
  }
};

export const resetSectionProducts = () => dispatch => {
  dispatch({ type: "RESET_SECTION_PRODUCTS" });
};
