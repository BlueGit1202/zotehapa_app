import axios from "axios";
import appService from "../../../services/appService";

export const administratorActions = {
  lists: payload => async dispatch => {
    try {
      let url = "admin/administrator";
      if (payload) {
        url = url + appService.requestHandler(payload);
      }
      const res = await axios.get(url);

      if (typeof payload.vuex === "undefined" || payload.vuex === true) {
        dispatch({ type: "SET_ADMINISTRATOR_LISTS", payload: res.data.data });
        dispatch({ type: "SET_ADMINISTRATOR_PAGE", payload: res.data.meta });
        dispatch({ type: "SET_ADMINISTRATOR_PAGINATION", payload: res.data });
      }
      return res;
    } catch (err) {
      throw err;
    }
  },

  save: payload => async (dispatch, getState) => {
    try {
      const { temp } = getState().administrator;
      let method = axios.post;
      let url = "/admin/administrator";

      if (temp.isEditing) {
        method = axios.post;
        url = `/admin/administrator/${temp.temp_id}`;
      }

      const res = await method(url, payload.form);
      dispatch(administratorActions.lists(payload.search));
      dispatch({ type: "RESET_ADMINISTRATOR" });
      return res;
    } catch (err) {
      throw err;
    }
  },

  show: payload => async dispatch => {
    try {
      const res = await axios.get(`admin/administrator/show/${payload}`);
      dispatch({ type: "SET_ADMINISTRATOR_SHOW", payload: res.data.data });
      return res;
    } catch (err) {
      throw err;
    }
  },

  edit: payload => async dispatch => {
    dispatch({ type: "SET_ADMINISTRATOR_TEMP", payload });
  },

  destroy: payload => async dispatch => {
    try {
      const res = await axios.delete(`admin/administrator/${payload.id}`);
      dispatch(administratorActions.lists(payload.search));
      return res;
    } catch (err) {
      throw err;
    }
  },

  export: payload => async () => {
    try {
      let url = "admin/administrator/export";
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
        `/admin/administrator/change-password/${payload.id}`,
        payload.form
      );
      dispatch(administratorActions.show(payload.id));
      return res;
    } catch (err) {
      throw err;
    }
  },

  changeImage: payload => async dispatch => {
    try {
      const res = await axios.post(
        `/admin/administrator/change-image/${payload.id}`,
        payload.form,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );
      dispatch({ type: "SET_ADMINISTRATOR_SHOW", payload: res.data.data });
      return res;
    } catch (err) {
      throw err;
    }
  },

  myOrders: payload => async dispatch => {
    try {
      let url = `admin/administrator/my-order/${payload.id}`;
      if (payload.search) {
        url = url + appService.requestHandler(payload.search);
      }
      const res = await axios.get(url);

      if (typeof payload.vuex === "undefined" || payload.vuex === true) {
        dispatch({
          type: "SET_ADMINISTRATOR_MY_ORDERS",
          payload: res.data.data
        });
        dispatch({
          type: "SET_ADMINISTRATOR_ORDER_PAGE",
          payload: res.data.meta
        });
        dispatch({
          type: "SET_ADMINISTRATOR_ORDER_PAGINATION",
          payload: res.data
        });
      }
      return res;
    } catch (err) {
      throw err;
    }
  },

  reset: () => dispatch => {
    dispatch({ type: "RESET_ADMINISTRATOR" });
  }
};
