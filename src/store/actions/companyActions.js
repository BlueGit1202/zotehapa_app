import axios from "axios";

export const companyActions = {
  lists: () => async dispatch => {
    try {
      const res = await axios.get("admin/setting/company");
      dispatch({ type: "COMPANY_LISTS", payload: res.data.data });
      return res;
    } catch (err) {
      throw err;
    }
  },
  save: payload => async dispatch => {
    try {
      const res = await axios.put("/admin/setting/company", payload);
      dispatch({ type: "COMPANY_LISTS", payload });
      return res;
    } catch (err) {
      throw err;
    }
  }
};
