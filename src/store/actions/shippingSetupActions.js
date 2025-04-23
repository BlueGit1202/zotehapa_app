import axios from "axios";

export const shippingSetupActions = {
  lists: () => async dispatch => {
    try {
      const res = await axios.get("admin/setting/shipping-setup");
      dispatch({
        type: "SHIPPING_SETUP_LISTS",
        payload: res.data.data
      });
      return res;
    } catch (err) {
      throw err;
    }
  },
  save: payload => async dispatch => {
    try {
      const res = await axios.put("/admin/setting/shipping-setup", payload);
      dispatch({
        type: "SHIPPING_SETUP_LISTS",
        payload: res.data.data
      });
      return res;
    } catch (err) {
      throw err;
    }
  }
};
