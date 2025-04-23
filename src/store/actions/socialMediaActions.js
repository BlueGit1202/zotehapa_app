import axios from "axios";

const socialMediaActions = {
  lists: () => async dispatch => {
    try {
      dispatch({ type: "socialMedia/listsRequest" });
      const response = await axios.get("admin/setting/social-media");
      dispatch({
        type: "socialMedia/listsSuccess",
        payload: response.data.data
      });
      return response.data;
    } catch (error) {
      dispatch({
        type: "socialMedia/listsFailure",
        payload: error.response.data
      });
      throw error;
    }
  },

  save: data => async dispatch => {
    try {
      dispatch({ type: "socialMedia/saveRequest" });
      const response = await axios.put("admin/setting/social-media", data);
      dispatch({ type: "socialMedia/saveSuccess", payload: data });
      return response.data;
    } catch (error) {
      dispatch({
        type: "socialMedia/saveFailure",
        payload: error.response.data
      });
      throw error;
    }
  }
};

export default socialMediaActions;
