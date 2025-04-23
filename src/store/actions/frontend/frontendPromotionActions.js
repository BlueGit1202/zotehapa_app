import axios from "axios";
import appService from "../../../../services/appService";

export const fetchPromotions = (payload = {}) => async dispatch => {
  try {
    dispatch({ type: "PROMOTION_REQUEST" });
    let url = "frontend/promotion";
    if (payload) url += appService.requestHandler(payload);
    const res = await axios.get(url);
    if (typeof payload.vuex === "undefined" || payload.vuex === true) {
      dispatch({ type: "FETCH_PROMOTIONS_SUCCESS", payload: res.data.data });
    }
    return res.data;
  } catch (error) {
    dispatch({ type: "PROMOTION_FAILURE", payload: error.message });
    throw error;
  }
};

export const fetchPromotion = id => async dispatch => {
  try {
    dispatch({ type: "PROMOTION_REQUEST" });
    const res = await axios.get(`frontend/promotion/show/${id}`);
    dispatch({ type: "FETCH_PROMOTION_SUCCESS", payload: res.data.data });
    return res.data;
  } catch (error) {
    dispatch({ type: "PROMOTION_FAILURE", payload: error.message });
    throw error;
  }
};

export const fetchPromotionProducts = (
  slug,
  payload = {}
) => async dispatch => {
  try {
    dispatch({ type: "PROMOTION_REQUEST" });
    let url = `frontend/promotion/products/${slug}`;
    if (payload) url += appService.requestHandler(payload);
    const res = await axios.get(url);
    if (typeof payload.vuex === "undefined" || payload.vuex === true) {
      dispatch({
        type: "FETCH_PROMOTION_PRODUCTS_SUCCESS",
        payload: {
          products: res.data.data,
          page: res.data.meta,
          pagination: res.data
        }
      });
    }
    return res.data;
  } catch (error) {
    dispatch({ type: "PROMOTION_FAILURE", payload: error.message });
    throw error;
  }
};

export const resetPromotionProducts = () => dispatch => {
  dispatch({ type: "PROMOTION_FAILURE" });
};
