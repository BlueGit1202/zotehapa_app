import appService from "../../../services/appService";
import axios from "axios";

export const analyticActions = {
  lists: payload => async dispatch => {
    try {
      let url = "admin/setting/analytic";
      if (payload) {
        url = url + appService.requestHandler(payload);
      }
      const res = await axios.get(url);
      dispatch({ type: "ANALYTIC_LISTS", payload: res.data });
      return res;
    } catch (err) {
      throw err;
    }
  },
  save: payload => async (dispatch, getState) => {
    try {
      const { temp } = getState().analytic;
      let method = axios.post;
      let url = "/admin/setting/analytic";
      if (temp.isEditing) {
        method = axios.put;
        url = `/admin/setting/analytic/${temp.temp_id}`;
      }
      const res = await method(url, payload.form);
      dispatch(analyticActions.lists(payload.search));
      dispatch({ type: "ANALYTIC_RESET" });
      return res;
    } catch (err) {
      throw err;
    }
  },
  edit: payload => dispatch => {
    dispatch({ type: "ANALYTIC_TEMP", payload });
  },
  destroy: payload => async dispatch => {
    try {
      const res = await axios.delete(`admin/setting/analytic/${payload.id}`);
      dispatch(analyticActions.lists(payload.search));
      return res;
    } catch (err) {
      throw err;
    }
  },
  show: payload => async dispatch => {
    try {
      const res = await axios.get(`admin/setting/analytic/show/${payload}`);
      dispatch({ type: "ANALYTIC_SHOW", payload: res.data });
      return res;
    } catch (err) {
      throw err;
    }
  },
  reset: () => dispatch => {
    dispatch({ type: "ANALYTIC_RESET" });
  }
};
