import axios from "axios";
import appService from "../../../../services/appService";

export const fetchPaymentGateways = (payload = {}) => async dispatch => {
  try {
    dispatch({ type: "FETCH_PAYMENT_GATEWAYS_REQUEST" });
    let url = "frontend/payment-gateway";
    if (payload) url += appService.requestHandler(payload);
    const res = await axios.get(url);
    if (typeof payload.vuex === "undefined" || payload.vuex === true) {
      dispatch({
        type: "FETCH_PAYMENT_GATEWAYS_SUCCESS",
        payload: res.data.data
      });
    }
    return res.data;
  } catch (error) {
    dispatch({ type: "PAYMENT_GATEWAY_FAILURE", payload: error.message });
    throw error;
  }
};
