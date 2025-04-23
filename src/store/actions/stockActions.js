import axios from "axios";
import appService from "../../../services/appService";

export const stockActions = {
  lists: payload => async dispatch => {
    try {
      let url = "admin/stock";
      if (payload) {
        url = url + appService.requestHandler(payload);
      }
      const res = await axios.get(url);
      dispatch({ type: "SET_STOCK_LISTS", payload: res.data });
      return res;
    } catch (err) {
      throw err;
    }
  },
  export: payload => async dispatch => {
    try {
      let url = "admin/stock/export";
      if (payload) {
        url = url + appService.requestHandler(payload);
      }
      const res = await axios.get(url, { responseType: "blob" });
      return res;
    } catch (err) {
      throw err;
    }
  }
};
