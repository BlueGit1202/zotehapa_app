import axios from "axios";

export const cookiesActions = {
  lists: () => async dispatch => {
    try {
      const res = await axios.get("admin/setting/cookies");
      dispatch({ type: "COOKIES_LISTS", payload: res.data.data });
      return res;
    } catch (err) {
      throw err;
    }
  },
  save: payload => async dispatch => {
    try {
      const res = await axios.put("/admin/setting/cookies", payload);
      dispatch({ type: "COOKIES_LISTS", payload });
      return res;
    } catch (err) {
      throw err;
    }
  }
};
