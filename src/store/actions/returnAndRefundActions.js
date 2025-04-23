import axios from "axios";
import appService from "../../../services/appService";

export const returnAndRefundActions = {
  lists: payload => async dispatch => {
    try {
      let url = "admin/return-and-refund";
      if (payload) {
        url = url + appService.requestHandler(payload);
      }
      const res = await axios.get(url);

      if (typeof payload.vuex === "undefined" || payload.vuex === true) {
        dispatch({ type: "SET_RETURN_AND_REFUND_LISTS", payload: res.data });
      }
      return res;
    } catch (err) {
      throw err;
    }
  },
  show: payload => async dispatch => {
    try {
      const res = await axios.get(`admin/return-and-refund/show/${payload}`);
      dispatch({ type: "SET_RETURN_AND_REFUND_SHOW", payload: res.data });
      return res;
    } catch (err) {
      throw err;
    }
  },
  changeStatus: payload => async dispatch => {
    try {
      const res = await axios.post(
        `admin/return-and-refund/change-status/${payload.id}`,
        payload
      );
      dispatch({ type: "UPDATE_RETURN_AND_REFUND_STATUS", payload: res.data });
      return res;
    } catch (err) {
      throw err;
    }
  },
  reset: () => dispatch => {
    dispatch({ type: "RESET_RETURN_AND_REFUND_TEMP" });
  },
  export: payload => async () => {
    try {
      let url = "admin/return-and-refund/export";
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
