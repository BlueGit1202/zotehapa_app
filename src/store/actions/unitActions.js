import axios from "axios";
import appService from "../../../services/appService";

export const unitActions = {
  lists: payload => async dispatch => {
    try {
      let url = "admin/setting/unit";
      if (payload) {
        url = url + appService.requestHandler(payload);
      }
      const res = await axios.get(url);
      dispatch({ type: "SET_UNIT_LISTS", payload: res.data });
      return res;
    } catch (err) {
      throw err;
    }
  },
  save: payload => async (dispatch, getState) => {
    try {
      const { temp } = getState().unit;
      let method = axios.post;
      let url = "/admin/setting/unit";
      if (temp.isEditing) {
        method = axios.put;
        url = `/admin/setting/unit/${temp.temp_id}`;
      }
      const res = await method(url, payload.form);
      dispatch(unitActions.lists(payload.search));
      dispatch({ type: "RESET_UNIT" });
      return res;
    } catch (err) {
      throw err;
    }
  },
  edit: payload => dispatch => {
    dispatch({ type: "SET_UNIT_TEMP", payload });
  },
  destroy: payload => async dispatch => {
    try {
      const res = await axios.delete(`admin/setting/unit/${payload.id}`);
      dispatch(unitActions.lists(payload.search));
      return res;
    } catch (err) {
      throw err;
    }
  },
  show: payload => async dispatch => {
    try {
      const res = await axios.get(`admin/setting/unit/show/${payload}`);
      dispatch({ type: "SET_UNIT_SHOW", payload: res.data.data });
      return res;
    } catch (err) {
      throw err;
    }
  },
  reset: () => dispatch => {
    dispatch({ type: "RESET_UNIT" });
  }
};
