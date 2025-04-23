import axios from "axios";
import appService from "../../../../services/appService";

export const fetchSettings = (payload = {}) => async dispatch => {
  try {
    dispatch({ type: "SETTING_REQUEST" });
    let url = "frontend/setting";
    if (payload) url += appService.requestHandler(payload);
    const res = await axios.get(url);
    dispatch({ type: "FETCH_SETTINGS_SUCCESS", payload: res.data.data });
    return res.data;
  } catch (error) {
    dispatch({ type: "SETTING_FAILURE", payload: error.message });
    throw error;
  }
};
