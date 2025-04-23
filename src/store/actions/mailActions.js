import axios from "axios";

export const mailActions = {
  lists: () => async dispatch => {
    try {
      const res = await axios.get("admin/setting/mail");
      dispatch({
        type: "SET_MAIL_DATA",
        payload: res.data.data
      });
      return Promise.resolve(res);
    } catch (err) {
      return Promise.reject(err);
    }
  },

  save: payload => async dispatch => {
    try {
      const res = await axios.put("/admin/setting/mail", payload);
      dispatch({
        type: "SET_MAIL_DATA",
        payload: payload
      });
      return Promise.resolve(res);
    } catch (err) {
      return Promise.reject(err);
    }
  }
};
