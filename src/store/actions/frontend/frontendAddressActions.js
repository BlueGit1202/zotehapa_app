import axios from "axios";
import appService from "../../../../services/appService";

export const frontendAddressActions = {
  lists: payload => async dispatch => {
    try {
      let url = "frontend/address";
      if (payload) {
        url = url + appService.requestHandler(payload.search);
      }
      const res = await axios.get(url);
      dispatch({ type: "SET_FRONTEND_ADDRESS_LISTS", payload: res.data });
      return res;
    } catch (err) {
      throw err;
    }
  },
  save: payload => async (dispatch, getState) => {
    try {
      console.log("adress data", payload)
      const { temp } = getState().frontendAddress;
      let method = axios.post;
      let url = "/frontend/address";
      if (temp.isEditing) {
        method = axios.put;
        url = `/frontend/address/${temp.temp_id}`;
      }
      const res = await method(url, payload.form);
      dispatch(frontendAddressActions.lists({ search: payload.search }));
      dispatch({ type: "RESET_FRONTEND_ADDRESS" });
      return res;
    } catch (err) {
      throw err;
    }
  },
  edit: payload => dispatch => {
    dispatch({ type: "SET_FRONTEND_ADDRESS_TEMP", payload });
  },
  destroy: payload => async dispatch => {
    try {
      const res = await axios.delete(`frontend/address/${payload.id}`);
      dispatch(frontendAddressActions.lists({ search: payload.search }));
      return res;
    } catch (err) {
      throw err;
    }
  },
  reset: () => dispatch => {
    dispatch({ type: "RESET_FRONTEND_ADDRESS" });
  }
};
