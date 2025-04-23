import axios from "axios";
import appService from "../../../services/appService";

export const transactionActions = {
  lists: payload => async dispatch => {
    try {
      let url = "admin/transaction";
      if (payload) {
        url = url + appService.requestHandler(payload);
      }
      const res = await axios.get(url);
      dispatch({ type: "SET_TRANSACTION_LISTS", payload: res.data });
      return res;
    } catch (err) {
      throw err;
    }
  },
  export: payload => async dispatch => {
    try {
      let url = "admin/transaction/export";
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
    dispatch({ type: "RESET_TRANSACTION" });
  }
};
