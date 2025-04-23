import axios from "axios";
import appService from "../../../services/appService";

export const creditBalanceReportActions = {
  lists: payload => async dispatch => {
    try {
      let url = "admin/credit-balance-report";
      if (payload) {
        url = url + appService.requestHandler(payload);
      }
      const res = await axios.get(url);

      if (typeof payload?.vuex === "undefined" || payload?.vuex === true) {
        dispatch({ type: "SET_CREDIT_BALANCE_REPORT_LISTS", payload: res.data.data });
        dispatch({ type: "SET_CREDIT_BALANCE_REPORT_PAGE", payload: res.data.meta });
        dispatch({ type: "SET_CREDIT_BALANCE_REPORT_PAGINATION", payload: res.data });
      }
      return res;
    } catch (err) {
      throw err;
    }
  },

  export: payload => async () => {
    try {
      let url = "admin/credit-balance-report/export";
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