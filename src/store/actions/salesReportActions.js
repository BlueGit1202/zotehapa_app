import axios from "axios";
import appService from "../../../services/appService";

export const salesReportActions = {
  lists: payload => async dispatch => {
    try {
      let url = "admin/sales-report";
      if (payload) {
        url = url + appService.requestHandler(payload);
      }
      const res = await axios.get(url);

      if (typeof payload.vuex === "undefined" || payload.vuex === true) {
        dispatch({ type: "SET_SALES_REPORT_LISTS", payload: res.data });
      }
      return res;
    } catch (err) {
      throw err;
    }
  },
  export: payload => async () => {
    try {
      let url = "admin/sales-report/export";
      if (payload) {
        url = url + appService.requestHandler(payload);
      }
      const res = await axios.get(url, { responseType: "blob" });
      return res;
    } catch (err) {
      throw err;
    }
  },
  reset: () => dispatch => {
    dispatch({ type: "RESET_SALES_REPORT_TEMP" });
  }
};
