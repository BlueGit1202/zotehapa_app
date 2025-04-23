import axios from "axios";
import appService from "../../../services/appService";

export const roleActions = {
  lists: payload => async dispatch => {
    try {
      let url = "admin/setting/role";
      if (payload) {
        url = url + appService.requestHandler(payload);
      }
      const res = await axios.get(url);
      if (typeof payload.vuex === "undefined" || payload.vuex === true) {
        dispatch({
          type: "ROLE_LISTS",
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
      const { temp } = getState().role;
      let method = axios.post;
      let url = "/admin/setting/role";
      if (temp.isEditing) {
        method = axios.put;
        url = `/admin/setting/role/${temp.temp_id}`;
      }
      const res = await method(url, payload.form);
      dispatch(roleActions.lists(payload.search));
      dispatch({ type: "ROLE_RESET" });
      return res;
    } catch (err) {
      throw err;
    }
  },
  edit: payload => dispatch => {
    dispatch({
      type: "ROLE_TEMP",
      payload
    });
  },
  destroy: payload => async dispatch => {
    try {
      const res = await axios.delete(`admin/setting/role/${payload.id}`);
      dispatch(roleActions.lists(payload.search));
      return res;
    } catch (err) {
      throw err;
    }
  },
  show: payload => async dispatch => {
    try {
      const res = await axios.get(`admin/setting/role/show/${payload}`);
      dispatch({
        type: "ROLE_SHOW",
        payload: res.data.data
      });
      return res;
    } catch (err) {
      throw err;
    }
  },
  reset: () => dispatch => {
    dispatch({ type: "ROLE_RESET" });
  }
};
