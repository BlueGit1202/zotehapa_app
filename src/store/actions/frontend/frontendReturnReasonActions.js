import axios from "axios";
import appService from "../../../../services/appService";

export const returnReasonActions = {
  lists: payload => async dispatch => {
    try {
      let url = "admin/setting/return-reason";
      if (payload) {
        url = url + appService.requestHandler(payload);
      }
      const res = await axios.get(url);
      if (typeof payload.vuex === "undefined" || payload.vuex === true) {
        dispatch({
          type: "RETURN_REASON_LISTS",
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
      const { temp } = getState().returnReason;
      let method = axios.post;
      let url = "/admin/setting/return-reason";
      if (temp.isEditing) {
        method = axios.put;
        url = `/admin/setting/return-reason/${temp.temp_id}`;
      }
      const res = await method(url, payload.form);
      dispatch(returnReasonActions.lists(payload.search));
      dispatch({ type: "RETURN_REASON_RESET" });
      return res;
    } catch (err) {
      throw err;
    }
  },
  edit: payload => dispatch => {
    dispatch({
      type: "RETURN_REASON_TEMP",
      payload
    });
  },
  destroy: payload => async dispatch => {
    try {
      const res = await axios.delete(
        `admin/setting/return-reason/${payload.id}`
      );
      dispatch(returnReasonActions.lists(payload.search));
      return res;
    } catch (err) {
      throw err;
    }
  },
  show: payload => async dispatch => {
    try {
      const res = await axios.get(
        `admin/setting/return-reason/show/${payload}`
      );
      dispatch({
        type: "RETURN_REASON_SHOW",
        payload: res.data.data
      });
      return res;
    } catch (err) {
      throw err;
    }
  },
  reset: () => dispatch => {
    dispatch({ type: "RETURN_REASON_RESET" });
  }
};
