import appService from "../../../services/appService";
import axios from "axios";

export const analyticSectionActions = {
  lists: payload => async dispatch => {
    try {
      let url = `admin/setting/analytic-section/${payload.analyticId}`;
      if (payload) {
        url = url + appService.requestHandler(payload.search);
      }
      const res = await axios.get(url);
      dispatch({ type: "ANALYTIC_SECTION_LISTS", payload: res.data });
      return res;
    } catch (err) {
      throw err;
    }
  },
  save: payload => async (dispatch, getState) => {
    try {
      const { temp } = getState().analyticSection;
      let method = axios.post;
      let url = `/admin/setting/analytic-section/${payload.analyticId}`;
      if (temp.isEditing) {
        method = axios.put;
        url = `/admin/setting/analytic-section/${payload.analyticId}/${temp.temp_id}`;
      }
      const res = await method(url, payload.form);
      dispatch(analyticSectionActions.lists(payload));
      dispatch({ type: "ANALYTIC_SECTION_RESET" });
      return res;
    } catch (err) {
      throw err;
    }
  },
  edit: payload => dispatch => {
    dispatch({ type: "ANALYTIC_SECTION_TEMP", payload });
  },
  destroy: payload => async dispatch => {
    try {
      const res = await axios.delete(
        `admin/setting/analytic-section/${payload.analyticId}/${payload.id}`
      );
      dispatch(
        analyticSectionActions.lists({
          analyticId: payload.analyticId,
          search: payload.search
        })
      );
      return res;
    } catch (err) {
      throw err;
    }
  },
  show: payload => async dispatch => {
    try {
      const res = await axios.get(`admin/setting/analytic/show/${payload}`);
      dispatch({ type: "ANALYTIC_SECTION_SHOW", payload: res.data });
      return res;
    } catch (err) {
      throw err;
    }
  },
  reset: () => dispatch => {
    dispatch({ type: "ANALYTIC_SECTION_RESET" });
  }
};
