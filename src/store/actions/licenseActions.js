import axios from "axios";

export const licenseActions = {
  lists: () => async dispatch => {
    try {
      const res = await axios.get("admin/setting/license");
      dispatch({ type: "LICENSE_LISTS", payload: res.data.data });
      return res;
    } catch (err) {
      throw err;
    }
  },
  save: payload => async dispatch => {
    try {
      const res = await axios.put("/admin/setting/license", payload);
      dispatch({ type: "LICENSE_LISTS", payload });
      return res;
    } catch (err) {
      throw err;
    }
  }
};
