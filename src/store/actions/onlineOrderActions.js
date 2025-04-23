import axios from "axios";
import appService from "../../../services/appService";

export const onlineOrderActions = {
  lists: payload => async dispatch => {
    try {
      let url = "admin/online-order";
      if (payload) {
        url = url + appService.requestHandler(payload);
      }
      const res = await axios.get(url);
      if (typeof payload.vuex === "undefined" || payload.vuex === true) {
        dispatch({ type: "SET_ONLINE_ORDER_LISTS", payload: res.data.data });
        dispatch({ type: "SET_ONLINE_ORDER_PAGE", payload: res.data.meta });
        dispatch({ type: "SET_ONLINE_ORDER_PAGINATION", payload: res.data });
      }
      return res;
    } catch (err) {
      throw err;
    }
  },

  show: payload => async dispatch => {
    try {
      const res = await axios.get(`admin/online-order/show/${payload}`);
      dispatch({ type: "SET_ONLINE_ORDER_SHOW", payload: res.data.data });
      dispatch({
        type: "SET_ONLINE_ORDER_PRODUCTS",
        payload: res.data.data.order_products
      });
      dispatch({ type: "SET_ONLINE_ORDER_USER", payload: res.data.data.user });
      dispatch({
        type: "SET_ONLINE_ORDER_ADDRESS",
        payload: res.data.data.order_address
      });
      dispatch({
        type: "SET_ONLINE_ORDER_OUTLET_ADDRESS",
        payload: res.data.data.outlet_address
      });
      return res;
    } catch (err) {
      throw err;
    }
  },

  changeStatus: payload => async dispatch => {
    try {
      const res = await axios.post(
        `admin/online-order/change-status/${payload.id}`,
        payload
      );
      dispatch({ type: "SET_ONLINE_ORDER_SHOW", payload: res.data.data });
      return res;
    } catch (err) {
      throw err;
    }
  },

  changePaymentStatus: payload => async dispatch => {
    try {
      const res = await axios.post(
        `admin/online-order/change-payment-status/${payload.id}`,
        payload
      );
      dispatch({ type: "SET_ONLINE_ORDER_SHOW", payload: res.data.data });
      return res;
    } catch (err) {
      throw err;
    }
  },

  export: payload => async () => {
    try {
      let url = "admin/online-order/export";
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
    dispatch({ type: "RESET_ONLINE_ORDER_TEMP" });
  }
};
