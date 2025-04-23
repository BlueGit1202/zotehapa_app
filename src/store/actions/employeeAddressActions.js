import axios from "axios";
import appService from "../../../services/appService";

export const employeeAddressActions = {
  lists: payload => async dispatch => {
    try {
      let url = `admin/employee/address/${payload.id}`;
      if (payload) {
        url = url + appService.requestHandler(payload.search);
      }
      const res = await axios.get(url);
      if (typeof payload.vuex === "undefined" || payload.vuex === true) {
        dispatch({
          type: "SET_EMPLOYEE_ADDRESS_LISTS",
          payload: res.data.data
        });
        dispatch({ type: "SET_EMPLOYEE_ADDRESS_PAGE", payload: res.data.meta });
        dispatch({
          type: "SET_EMPLOYEE_ADDRESS_PAGINATION",
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
      const { temp } = getState().employeeAddress;
      let method = axios.post;
      let url = `/admin/employee/address/${payload.id}`;
      if (temp.isEditing) {
        method = axios.put;
        url = `/admin/employee/address/${payload.id}/${temp.temp_id}`;
      }
      const res = await method(url, payload.form);
      dispatch(
        employeeAddressActions.lists({ id: payload.id, search: payload.search })
      );
      dispatch({ type: "RESET_EMPLOYEE_ADDRESS_TEMP" });
      return res;
    } catch (err) {
      throw err;
    }
  },

  edit: payload => dispatch => {
    dispatch({ type: "SET_EMPLOYEE_ADDRESS_TEMP", payload });
  },

  destroy: payload => async dispatch => {
    try {
      const res = await axios.delete(
        `admin/employee/address/${payload.id}/${payload.addressId}`
      );
      dispatch(
        employeeAddressActions.lists({ id: payload.id, search: payload.search })
      );
      return res;
    } catch (err) {
      throw err;
    }
  },

  show: payload => async dispatch => {
    try {
      const res = await axios.get(
        `admin/employee/address/show/${payload.id}/${payload.addressId}`
      );
      dispatch({ type: "SET_EMPLOYEE_ADDRESS_SHOW", payload: res.data.data });
      return res;
    } catch (err) {
      throw err;
    }
  },

  reset: () => dispatch => {
    dispatch({ type: "RESET_EMPLOYEE_ADDRESS_TEMP" });
  }
};
