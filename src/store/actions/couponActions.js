import axios from "axios";
import appService from "../../../services/appService";

export const couponActions = {
  lists: payload => async dispatch => {
    try {
      let url = "admin/coupon";
      if (payload) {
        url = url + appService.requestHandler(payload);
      }
      const res = await axios.get(url);

      if (typeof payload?.vuex === "undefined" || payload?.vuex === true) {
        dispatch({ type: "SET_COUPON_LISTS", payload: res.data.data });
        dispatch({ type: "SET_COUPON_PAGE", payload: res.data.meta });
        dispatch({ type: "SET_COUPON_PAGINATION", payload: res.data });
      }
      return res;
    } catch (err) {
      throw err;
    }
  },

  save: payload => async (dispatch, getState) => {
    try {
      const { temp } = getState().coupon;
      let method = axios.post;
      let url = "/admin/coupon";

      if (temp.isEditing) {
        method = axios.post;
        url = `/admin/coupon/${temp.temp_id}`;
      }

      const res = await method(url, payload.form);
      dispatch(couponActions.lists(payload.search));
      dispatch({ type: "RESET_COUPON" });
      return res;
    } catch (err) {
      throw err;
    }
  },

  show: payload => async dispatch => {
    try {
      const res = await axios.get(`admin/coupon/show/${payload}`);
      dispatch({ type: "SET_COUPON_SHOW", payload: res.data.data });
      return res;
    } catch (err) {
      throw err;
    }
  },

  edit: payload => async dispatch => {
    dispatch({ type: "SET_COUPON_TEMP", payload });
  },

  destroy: payload => async dispatch => {
    try {
      const res = await axios.delete(`admin/coupon/${payload.id}`);
      dispatch(couponActions.lists(payload.search));
      return res;
    } catch (err) {
      throw err;
    }
  },

  export: payload => async () => {
    try {
      let url = "admin/coupon/export";
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
    dispatch({ type: "RESET_COUPON" });
  }
};