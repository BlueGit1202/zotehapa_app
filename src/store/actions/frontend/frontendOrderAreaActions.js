import axios from "axios";
import appService from "../../../../services/appService";

export const fetchOrderAreas = (payload = {}) => async dispatch => {
  try {
    dispatch({ type: "FETCH_ORDER_AREAS_REQUEST" });
    let url = "frontend/order-area";
    if (payload) url += appService.requestHandler(payload);
    const res = await axios.get(url);
    dispatch({ type: "FETCH_ORDER_AREAS_SUCCESS", payload: res.data.data });
    return res.data;
  } catch (error) {
    dispatch({ type: "ORDER_AREA_FAILURE", payload: error.message });
    throw error;
  }
};
