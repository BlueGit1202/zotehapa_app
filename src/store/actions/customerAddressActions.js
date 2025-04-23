import axios from "axios";
import appService from "../../../services/appService";

export const customerAddressActions = {
  lists: payload => async dispatch => {
    try {
      let url = `admin/customer/address/${payload.id}`;
      if (payload.search) {
        url = url + appService.requestHandler(payload.search);
      }
      const res = await axios.get(url);

      if (typeof payload.vuex === "undefined" || payload.vuex === true) {
        dispatch({
          type: "SET_CUSTOMER_ADDRESS_LISTS",
          payload: res.data.data
        });
        dispatch({ type: "SET_CUSTOMER_ADDRESS_PAGE", payload: res.data.meta });
        dispatch({
          type: "SET_CUSTOMER_ADDRESS_PAGINATION",
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
      const { temp } = getState().customerAddress;
      let method = axios.post;
      let url = `/admin/customer/address/${payload.id}`;

      if (temp.isEditing) {
        method = axios.put;
        url = `/admin/customer/address/${payload.id}/${temp.temp_id}`;
      }

      const res = await method(url, payload.form);
      dispatch(
        customerAddressActions.lists({
          id: payload.id,
          search: payload.search
        })
      );
      dispatch({ type: "RESET_CUSTOMER_ADDRESS" });
      return res;
    } catch (err) {
      throw err;
    }
  },

  update: ({ id, customerId, form }) => async dispatch => {
    try {
      const response = await api.put(
        `/customers/${customerId}/addresses/${id}`,
        form
      );
      dispatch({ type: "CUSTOMER_ADDRESS_UPDATE", payload: response.data });
      return response;
    } catch (error) {
      throw error;
    }
  },

  edit: payload => async dispatch => {
    dispatch({ type: "SET_CUSTOMER_ADDRESS_TEMP", payload });
  },

  destroy: payload => async dispatch => {
    try {
      const res = await axios.delete(
        `admin/customer/address/${payload.id}/${payload.addressId}`
      );
      dispatch(
        customerAddressActions.lists({
          id: payload.id,
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
      const res = await axios.get(
        `admin/customer/address/show/${payload.id}/${payload.addressId}`
      );
      dispatch({ type: "SET_CUSTOMER_ADDRESS_SHOW", payload: res.data.data });
      return res;
    } catch (err) {
      throw err;
    }
  },

  reset: () => dispatch => {
    dispatch({ type: "RESET_CUSTOMER_ADDRESS" });
  }
};
