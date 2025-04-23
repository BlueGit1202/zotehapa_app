import axios from "axios";
import appService from "../../../../services/appService";

export const fetchOutlets = (payload = {}) => async dispatch => {
  try {
    dispatch({ type: "FETCH_OUTLETS_REQUEST" });
    let url = "frontend/outlet";
    if (payload) url += appService.requestHandler(payload);
    const res = await axios.get(url);
    dispatch({ type: "FETCH_OUTLETS_SUCCESS", payload: res.data });
    return res.data;
  } catch (error) {
    dispatch({ type: "OUTLET_FAILURE", payload: error.message });
    throw error;
  }
};
