import axios from "axios";
import appService from "../../../services/appService";

export const employeeActions = {
  lists: payload => async dispatch => {
    try {
      let url = "admin/employee";
      if (payload) {
        url = url + appService.requestHandler(payload);
      }
      const res = await axios.get(url);
      if (typeof payload.vuex === "undefined" || payload.vuex === true) {
        dispatch({ type: "SET_EMPLOYEE_LISTS", payload: res.data.data });
        dispatch({ type: "SET_EMPLOYEE_PAGE", payload: res.data.meta });
        dispatch({ type: "SET_EMPLOYEE_PAGINATION", payload: res.data });
      }
      return res;
    } catch (err) {
      throw err;
    }
  },

  save: payload => async (dispatch, getState) => {
    try {
      const { temp } = getState().employee;
      let method = axios.post;
      let url = "/admin/employee";

      if (temp.isEditing) {
        method = axios.put;
        url = `/admin/employee/${temp.temp_id}`;
        
        // Remove password fields if they're empty
        if (!payload.form.password) {
          delete payload.form.password;
          delete payload.form.password_confirmation;
        }
      }

      const res = await method(url, payload.form);
      
      // Refresh the list after save
      dispatch(employeeActions.lists(payload.search));
      dispatch({ type: "RESET_EMPLOYEE_TEMP" });
      
      return res;
    } catch (err) {
      throw err;
    }
  },

  edit: payload => dispatch => {
    dispatch({ type: "SET_EMPLOYEE_TEMP", payload });
  },

  destroy: payload => async dispatch => {
    try {
      const res = await axios.delete(`admin/employee/${payload.id}`);
      dispatch(employeeActions.lists(payload.search));
      return res;
    } catch (err) {
      throw err;
    }
  },

  show: payload => async dispatch => {
    try {
      const res = await axios.get(`admin/employee/show/${payload}`);
      dispatch({ type: "SET_EMPLOYEE_SHOW", payload: res.data.data });
      return res;
    } catch (err) {
      throw err;
    }
  },

  reset: () => dispatch => {
    dispatch({ type: "RESET_EMPLOYEE_TEMP" });
  },

  export: payload => async () => {
    try {
      let url = "admin/employee/export";
      if (payload) {
        url = url + appService.requestHandler(payload);
      }
      const res = await axios.get(url, { responseType: "blob" });
      return res;
    } catch (err) {
      throw err;
    }
  },

  changePassword: payload => async () => {
    try {
      const res = await axios.post(
        `/admin/employee/change-password/${payload.id}`,
        payload.form
      );
      return res;
    } catch (err) {
      throw err;
    }
  },

  changeImage: payload => async dispatch => {
    try {
      const res = await axios.post(
        `/admin/employee/change-image/${payload.id}`,
        payload.form,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );
      dispatch({ type: "SET_EMPLOYEE_SHOW", payload: res.data.data });
      return res;
    } catch (err) {
      throw err;
    }
  },

  myOrders: payload => async dispatch => {
    try {
      let url = `admin/employee/my-order/${payload.id}`;
      if (payload.search) {
        url = url + appService.requestHandler(payload.search);
      }
      const res = await axios.get(url);
      if (typeof payload.vuex === "undefined" || payload.vuex === true) {
        dispatch({ type: "SET_EMPLOYEE_MY_ORDERS", payload: res.data.data });
        dispatch({ type: "SET_EMPLOYEE_ORDER_PAGE", payload: res.data.meta });
        dispatch({ type: "SET_EMPLOYEE_ORDER_PAGINATION", payload: res.data });
      }
      return res;
    } catch (err) {
      throw err;
    }
  }
};
