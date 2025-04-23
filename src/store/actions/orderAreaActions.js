import axios from "axios";
import appService from "../../../services/appService";

export const orderAreaActions = {
  lists: payload => async dispatch => {
    try {
      let url = "admin/setting/order-area";
      if (payload) {
        url = url + appService.requestHandler(payload);
      }
      const res = await axios.get(url);
      if (typeof payload.vuex === "undefined" || payload.vuex === true) {
        dispatch({
          type: "ORDER_AREA_LISTS",
          payload: res.data
        });
      }
      return res;
    } catch (err) {
      throw err;
    }
  },
  save: payload => async (dispatch, getState) => {
    try {
      const { temp } = getState().orderArea;
      let method = axios.post;
      let url = "/admin/setting/order-area";
      if (temp.isEditing) {
        method = axios.put;
        url = `/admin/setting/order-area/${temp.temp_id}`;
      }
      const res = await method(url, payload.form);
      dispatch(orderAreaActions.lists(payload.search));
      dispatch({ type: "ORDER_AREA_RESET" });
      return res;
    } catch (err) {
      throw err;
    }
  },
  edit: payload => dispatch => {
    dispatch({
      type: "ORDER_AREA_TEMP",
      payload
    });
  },
  destroy: payload => async dispatch => {
    try {
      const res = await axios.delete(`admin/setting/order-area/${payload.id}`);
      dispatch(orderAreaActions.lists(payload.search));
      return res;
    } catch (err) {
      throw err;
    }
  },
  reset: () => dispatch => {
    dispatch({ type: "ORDER_AREA_RESET" });
  }
};
