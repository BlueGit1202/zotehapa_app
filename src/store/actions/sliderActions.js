import axios from "axios";

const sliderActions = {
  lists: search => async dispatch => {
    try {
      dispatch({ type: "slider/listsRequest" });
      const response = await axios.get("admin/slider", { params: search });
      dispatch({ type: "slider/listsSuccess", payload: response.data });
    } catch (error) {
      dispatch({ type: "slider/listsFailure", payload: error.response.data });
      throw error;
    }
  },

  show: id => async dispatch => {
    try {
      dispatch({ type: "slider/showRequest" });
      const response = await axios.get(`admin/slider/${id}`);
      dispatch({ type: "slider/showSuccess", payload: response.data.data });
    } catch (error) {
      dispatch({ type: "slider/showFailure", payload: error.response.data });
      throw error;
    }
  },

  save: data => async dispatch => {
    try {
      dispatch({ type: "slider/saveRequest" });
      const url = data.form.get("id")
        ? `admin/slider/${data.form.get("id")}`
        : "admin/slider";
      const method = data.form.get("id") ? "put" : "post";

      const response = await axios({
        method,
        url,
        data: data.form,
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      dispatch({ type: "slider/saveSuccess", payload: response.data.data });
      dispatch(sliderActions.lists(data.search));
      return response.data;
    } catch (error) {
      dispatch({ type: "slider/saveFailure", payload: error.response.data });
      throw error;
    }
  },

  destroy: data => async dispatch => {
    try {
      dispatch({ type: "slider/destroyRequest" });
      await axios.delete(`admin/slider/${data.id}`);
      dispatch({ type: "slider/destroySuccess" });
      dispatch(sliderActions.lists(data.search));
    } catch (error) {
      dispatch({ type: "slider/destroyFailure", payload: error.response.data });
      throw error;
    }
  }
};

export default sliderActions;
