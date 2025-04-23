import axios from "axios";
import appService from "../../../services/appService";

export const returnOrderActions = {
  lists: payload => async dispatch => {
    try {
      let url = "admin/return-order";
      if (payload) {
        url = url + appService.requestHandler(payload);
      }
      const res = await axios.get(url);

      if (typeof payload.vuex === "undefined" || payload.vuex === true) {
        dispatch({ type: "SET_RETURN_ORDER_LISTS", payload: res.data });
      }
      return res;
    } catch (err) {
      throw err;
    }
  },
  save: payload => async (dispatch, getState) => {
    try {
      const { temp } = getState().returnOrder;
      let method = axios.post;
      let url = "admin/return-order";

      if (temp.isEditing) {
        method = axios.post;
        url = `admin/return-order/update/${temp.temp_id}`;
      }

      const res = await method(url, payload.form);
      dispatch({ type: "RESET_RETURN_ORDER_TEMP" });
      dispatch(returnOrderActions.lists({ vuex: true }));
      return res;
    } catch (err) {
      throw err;
    }
  },
  show: payload => async dispatch => {
    try {
      const res = await axios.get(`admin/return-order/show/${payload}`);
      dispatch({ type: "SET_RETURN_ORDER_SHOW", payload: res.data });
      return res;
    } catch (err) {
      throw err;
    }
  },
  edit: payload => async dispatch => {
    try {
      const res = await axios.get(`admin/return-order/edit/${payload}`);
      dispatch({
        type: "SET_RETURN_ORDER_EDIT",
        payload: { data: res.data.data, id: payload }
      });
      return res;
    } catch (err) {
      throw err;
    }
  },
  destroy: payload => async dispatch => {
    try {
      const res = await axios.delete(`admin/return-order/${payload.id}`);
      dispatch(returnOrderActions.lists(payload.search));
      return res;
    } catch (err) {
      throw err;
    }
  },
  export: payload => async () => {
    try {
      let url = "admin/return-order/export";
      if (payload) {
        url = url + appService.requestHandler(payload);
      }
      const res = await axios.get(url, { responseType: "blob" });
      return res;
    } catch (err) {
      throw err;
    }
  },
  download: payload => async () => {
    try {
      const res = await axios.get(
        `admin/return-order/download-attachment/${payload}`,
        { responseType: "blob" }
      );
      return res;
    } catch (err) {
      throw err;
    }
  },
  reset: () => dispatch => {
    dispatch({ type: "RESET_RETURN_ORDER_TEMP" });
  }
};
