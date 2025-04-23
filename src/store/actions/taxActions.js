import axios from "axios";
import appService from "../../../services/appService";

export const taxActions = {
  lists: payload => async dispatch => {
    try {
      let url = "admin/setting/tax";
      if (payload) {
        url = url + appService.requestHandler(payload);
      }
      const res = await axios.get(url);
      dispatch({ type: "TAX_LIST_SUCCESS", payload: res.data });
      return res;
    } catch (err) {
      throw err;
    }
  },

  save: data => async (dispatch, getState) => {
    try {
      dispatch({ type: "TAX_SAVE_REQUEST" });

      const state = getState();
      const isEditing = state.tax.temp.isEditing;
      const tempId = state.tax.temp.temp_id;

      const url = isEditing
        ? `admin/setting/tax/${tempId}`
        : "admin/setting/tax";

      const method = isEditing ? "put" : "post";

      const response = await axios({
        method,
        url,
        data: data.form
      });

      dispatch({ type: "TAX_SAVE_SUCCESS", payload: response.data.data });
      dispatch(taxActions.lists(data.search));
      return response.data;
    } catch (error) {
      dispatch({ type: "TAX_SAVE_FAILURE", payload: error.response.data });
      throw error;
    }
  },

  show: id => async dispatch => {
    try {
      dispatch({ type: "tax/showRequest" });
      const response = await axios.get(`admin/setting/tax/show/${id}`);
      dispatch({ type: "tax/showSuccess", payload: response.data.data });
      return response.data;
    } catch (error) {
      dispatch({ type: "tax/showFailure", payload: error.response.data });
      throw error;
    }
  },

  destroy: data => async dispatch => {
    try {
      dispatch({ type: "tax/destroyRequest" });
      await axios.delete(`admin/setting/tax/${data.id}`);
      dispatch({ type: "tax/destroySuccess" });
      dispatch(taxActions.lists(data.search));
    } catch (error) {
      dispatch({ type: "tax/destroyFailure", payload: error.response.data });
      throw error;
    }
  },

  edit: id => async dispatch => {
    dispatch({ type: "tax/edit", payload: id });
  },

  reset: () => async dispatch => {
    dispatch({ type: "tax/reset" });
  }
};

