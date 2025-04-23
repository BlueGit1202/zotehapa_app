import axios from "axios";

export const paymentGatewayActions = {
  lists: payload => async dispatch => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const res = await axios.get("admin/setting/payment-gateway", {
        params: payload
      });
      dispatch({ type: "SET_PAYMENT_GATEWAYS", payload: res.data.data });
      return Promise.resolve(res);
    } catch (err) {
      dispatch({ type: "SET_LOADING", payload: false });
      return Promise.reject(err);
    }
  },

  save: payload => async dispatch => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const res = await axios.put(
        "/admin/setting/payment-gateway",
        payload.form
      );
      dispatch({ type: "SET_PAYMENT_GATEWAYS", payload: res.data.data });
      dispatch({ type: "SET_ERRORS", payload: {} });
      return Promise.resolve(res);
    } catch (err) {
      dispatch({ type: "SET_LOADING", payload: false });
      if (err.response && err.response.data.errors) {
        dispatch({ type: "SET_ERRORS", payload: err.response.data.errors });
      }
      return Promise.reject(err);
    }
  }
};
