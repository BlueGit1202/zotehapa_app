import axios from "axios";

export const outletActions = {
  lists: payload => async dispatch => {
    try {
      const res = await axios.get("admin/setting/outlets", { params: payload });
      dispatch({
        type: "SET_OUTLET_DATA",
        payload: res.data
      });
      dispatch({
        type: "SET_OUTLET_PAGE",
        payload: payload.page || 1
      });
      return Promise.resolve(res);
    } catch (err) {
      return Promise.reject(err);
    }
  },

  save: payload => async dispatch => {
    try {
      const url = payload.props.temp_id
        ? `/admin/setting/outlets/${payload.props.temp_id}`
        : "/admin/setting/outlets";

      const method = payload.props.temp_id ? "put" : "post";

      const res = await axios[method](url, payload.props.form);
      dispatch({
        type: "SET_OUTLET_TEMP",
        payload: res.data.data.id
      });
      return Promise.resolve(res);
    } catch (err) {
      return Promise.reject(err);
    }
  },

  show: id => async dispatch => {
    try {
      const res = await axios.get(`/admin/setting/outlets/${id}`);
      dispatch({
        type: "SET_OUTLET_SHOW",
        payload: res.data.data
      });
      return Promise.resolve(res);
    } catch (err) {
      return Promise.reject(err);
    }
  },

  edit: id => async dispatch => {
    try {
      dispatch({
        type: "SET_OUTLET_TEMP",
        payload: id
      });
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  },

  destroy: payload => async dispatch => {
    try {
      const res = await axios.delete(`/admin/setting/outlets/${payload.id}`);
      return Promise.resolve(res);
    } catch (err) {
      return Promise.reject(err);
    }
  },

  reset: () => async dispatch => {
    dispatch({
      type: "RESET_OUTLET"
    });
  }
};
