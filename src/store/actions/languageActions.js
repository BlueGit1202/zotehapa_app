import axios from "axios";
import appService from "../../../services/appService";

export const languageActions = {
  lists: payload => async dispatch => {
    try {
      let url = "admin/setting/language";
      if (payload) {
        url = url + appService.requestHandler(payload);
      }
      const res = await axios.get(url);
      dispatch({ type: "LANGUAGE_LISTS", payload: res.data });
      return res;
    } catch (err) {
      throw err;
    }
  },
  save: payload => async (dispatch, getState) => {
    try {
      const { temp } = getState().language;
      let method = axios.post;
      let url = "/admin/setting/language";
      if (temp.isEditing) {
        method = axios.post;
        url = `/admin/setting/language/update/${temp.temp_id}`;
      }
      const res = await method(url, payload.form);
      dispatch(languageActions.lists(payload.search));
      dispatch({ type: "LANGUAGE_RESET" });
      return res;
    } catch (err) {
      throw err;
    }
  },
  edit: payload => dispatch => {
    dispatch({ type: "LANGUAGE_TEMP", payload });
  },
  destroy: payload => async dispatch => {
    try {
      const res = await axios.delete(`admin/setting/language/${payload.id}`);
      dispatch(languageActions.lists(payload.search));
      return res;
    } catch (err) {
      throw err;
    }
  },
  show: payload => async dispatch => {
    try {
      const res = await axios.get(`admin/setting/language/show/${payload}`);
      dispatch({ type: "LANGUAGE_SHOW", payload: res.data.data });
      return res;
    } catch (err) {
      throw err;
    }
  },
  fileList: payload => async dispatch => {
    try {
      const res = await axios.get(
        `/admin/setting/language/file-list/${payload}`
      );
      dispatch({ type: "LANGUAGE_FILE_LIST", payload: res.data.data });
      return res;
    } catch (err) {
      throw err;
    }
  },
  fileText: payload => async dispatch => {
    try {
      const res = await axios.post(
        `/admin/setting/language/file-text`,
        payload
      );
      dispatch({ type: "LANGUAGE_FILE_TEXT", payload: res.data });
      return res;
    } catch (err) {
      throw err;
    }
  },
  fileStore: payload => async dispatch => {
    try {
      const res = await axios.post(
        `/admin/setting/language/file-text/store`,
        payload
      );
      dispatch({ type: "LANGUAGE_RESET_FILE_TEXT" });
      return res;
    } catch (err) {
      throw err;
    }
  },
  reset: () => dispatch => {
    dispatch({ type: "LANGUAGE_RESET" });
  }
};
