import axios from "axios";
import appService from "../../../services/appService";

export const subscriberActions = {
  lists: payload => async dispatch => {
    try {
      let url = "admin/subscriber";
      if (payload) {
        url = url + appService.requestHandler(payload);
      }
      const res = await axios.get(url);
      dispatch({ type: "SET_SUBSCRIBER_LISTS", payload: res.data });
      return res;
    } catch (err) {
      throw err;
    }
  },
  destroy: payload => async dispatch => {
    try {
      const res = await axios.delete(`admin/subscriber/${payload.id}`);
      dispatch(subscriberActions.lists(payload.search));
      return res;
    } catch (err) {
      throw err;
    }
  },
  export: payload => async dispatch => {
    try {
      let url = "admin/subscriber/export";
      if (payload) {
        url = url + appService.requestHandler(payload);
      }
      const res = await axios.get(url, { responseType: "blob" });
      return res;
    } catch (err) {
      throw err;
    }
  },
  sendEmail: payload => async dispatch => {
    try {
      const res = await axios.post(
        "/admin/subscriber/send-email",
        payload.form
      );
      dispatch(subscriberActions.lists(payload.search));
      dispatch({ type: "RESET_SUBSCRIBER" });
      return res;
    } catch (err) {
      throw err;
    }
  },
  reset: () => dispatch => {
    dispatch({ type: "RESET_SUBSCRIBER" });
  }
};
