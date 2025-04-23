import axios from "axios";
import appService from "../../../services/appService";

export const customerActions = {
  lists: payload => async dispatch => {
    try {
      let url = "admin/customer";
      if (payload) {
        url = url + appService.requestHandler(payload);
      }
      const res = await axios.get(url);

      if (typeof payload?.vuex === "undefined" || payload?.vuex === true) {
        dispatch({ type: "SET_CUSTOMER_LISTS", payload: res.data.data });
        dispatch({ type: "SET_CUSTOMER_PAGE", payload: res.data.meta });
        dispatch({ type: "SET_CUSTOMER_PAGINATION", payload: res.data });
      }
      return res;
    } catch (err) {
      throw err;
    }
  },

  save: payload => async (dispatch, getState) => {
  try {
    const { temp } = getState().customer;
    let method = axios.post;
    let url = "/admin/customer";

    if (temp.isEditing) {
      method = axios.post; // or axios.put if your API supports it
      url = `/admin/customer/${temp.temp_id}`;
    }

    const res = await method(url, payload.form);
    
    // Refresh the list after save
    dispatch(customerActions.lists(payload.search));
    dispatch({ type: "RESET_CUSTOMER" });
    
    return res;
  } catch (err) {
    throw err;
  }
},

  show: payload => async dispatch => {
    try {
      const res = await axios.get(`admin/customer/show/${payload}`);
      dispatch({ type: "SET_CUSTOMER_SHOW", payload: res.data.data });
      return res;
    } catch (err) {
      throw err;
    }
  },

  edit: payload => async dispatch => {
    console.log("editing user", payload);
    await dispatch({ type: "SET_CUSTOMER_TEMP", payload });
  },

  destroy: payload => async dispatch => {
    try {
      const res = await axios.delete(`admin/customer/${payload.id}`);
      dispatch(customerActions.lists(payload.search));
      return res;
    } catch (err) {
      throw err;
    }
  },

  export: payload => async () => {
    try {
      let url = "admin/customer/export";
      if (payload) {
        url = url + appService.requestHandler(payload);
      }
      const res = await axios.get(url, { responseType: "blob" });
      return res;
    } catch (err) {
      throw err;
    }
  },

  changePassword: payload => async dispatch => {
    try {
      const res = await axios.post(
        `/admin/customer/change-password/${payload.id}`,
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
        `/admin/customer/change-image/${payload.id}`,
        payload.form,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );
      dispatch({ type: "SET_CUSTOMER_SHOW", payload: res.data.data });
      return res;
    } catch (err) {
      throw err;
    }
  },

  myOrders: payload => async dispatch => {
    try {
      let url = `admin/customer/my-order/${payload.id}`;
      if (payload.search) {
        url = url + appService.requestHandler(payload.search);
      }
      const res = await axios.get(url);

      if (typeof payload.vuex === "undefined" || payload.vuex === true) {
        dispatch({ type: "SET_CUSTOMER_MY_ORDERS", payload: res.data.data });
        dispatch({ type: "SET_CUSTOMER_ORDER_PAGE", payload: res.data.meta });
        dispatch({ type: "SET_CUSTOMER_ORDER_PAGINATION", payload: res.data });
      }
      return res;
    } catch (err) {
      throw err;
    }
  },

  reset: () => dispatch => {
    dispatch({ type: "RESET_CUSTOMER" });
  }
};