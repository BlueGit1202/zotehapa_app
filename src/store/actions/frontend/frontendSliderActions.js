import axios from "axios";
import appService from "../../../../services/appService";

export const fetchSliders = payload => async dispatch => {
  try {
    let url = "frontend/slider";
    if (payload) url += appService.requestHandler(payload);
    const res = await axios.get(url);
    dispatch({ type: "slider/lists", payload: res.data.data });
    return res;
  } catch (err) {
    throw err;
  }
};
