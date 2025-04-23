import axios from "axios";

const siteActions = {
  lists: () => async dispatch => {
    try {
      dispatch({ type: "site/listsRequest" });
      const response = await axios.get("admin/setting/site");
      dispatch({ type: "site/listsSuccess", payload: response.data.data });
    } catch (error) {
      dispatch({ type: "site/listsFailure", payload: error.response.data });
      throw error;
    }
  },

  save: data => async dispatch => {
    try {
      dispatch({ type: "site/saveRequest" });
      const response = await axios.put("admin/setting/site", data);
      dispatch({ type: "site/saveSuccess", payload: response.data.data });
      dispatch({ type: "frontendSetting/lists" });
      return response.data;
    } catch (error) {
      dispatch({ type: "site/saveFailure", payload: error.response.data });
      throw error;
    }
  }
};

export default siteActions;
