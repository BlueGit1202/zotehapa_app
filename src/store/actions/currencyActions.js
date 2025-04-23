import axios from "axios";
import appService from "../../../services/appService";

export const currencyActions = {
  lists: payload => async dispatch => {
    try {
      let url = "admin/setting/currency";
      if (payload) {
        url = url + appService.requestHandler(payload);
      }
      const res = await axios.get(url);
      dispatch({ type: "CURRENCY_LISTS", payload: res.data });
      return res;
    } catch (err) {
      throw err;
    }
  },
  save: payload => async (dispatch, getState) => {
    try {
      const { temp } = getState().currency;
      let method = axios.post;
      let url = "/admin/setting/currency";
      if (temp.isEditing) {
        method = axios.put;
        url = `/admin/setting/currency/${temp.temp_id}`;
      }
      const res = await method(url, payload.form);
      dispatch(currencyActions.lists(payload.search));
      dispatch({ type: "CURRENCY_RESET" });
      return res;
    } catch (err) {
      throw err;
    }
  },
  edit: payload => dispatch => {
    dispatch({ type: "CURRENCY_TEMP", payload });
  },
  destroy: payload => async dispatch => {
    try {
      const res = await axios.delete(`admin/setting/currency/${payload.id}`);
      dispatch(currencyActions.lists(payload.search));
      return res;
    } catch (err) {
      throw err;
    }
  },
  reset: () => dispatch => {
    dispatch({ type: "CURRENCY_RESET" });
  }
};
