import axios from "axios";

const themeActions = {
  lists: () => async dispatch => {
    try {
      dispatch({ type: "theme/listsRequest" });
      const response = await axios.get("admin/setting/theme");
      dispatch({ type: "theme/listsSuccess", payload: response.data.data });
      return response.data;
    } catch (error) {
      dispatch({ type: "theme/listsFailure", payload: error.response.data });
      throw error;
    }
  },

  save: data => async dispatch => {
    try {
      dispatch({ type: "theme/saveRequest" });
      const response = await axios.post("admin/setting/theme", data.form, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      dispatch({ type: "theme/saveSuccess", payload: response.data.data });
      return response.data;
    } catch (error) {
      dispatch({ type: "theme/saveFailure", payload: error.response.data });
      throw error;
    }
  }
};

export default themeActions;
