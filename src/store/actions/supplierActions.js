import axios from "axios";
import appService from "../../../services/appService";

const supplierActions = {
  lists: search => async dispatch => {
    try {
      dispatch({ type: "supplier/listsRequest" });

      let url = "admin/setting/supplier";
      if (search) {
        url += appService.requestHandler(search);
      }

      const response = await axios.get(url);
      dispatch({ type: "supplier/listsSuccess", payload: response.data });
      return response.data;
    } catch (error) {
      dispatch({ type: "supplier/listsFailure", payload: error.response.data });
      throw error;
    }
  },

  save: data => async (dispatch, getState) => {
    try {
      dispatch({ type: "supplier/saveRequest" });

      const state = getState();
      const isEditing = state.supplier.temp.isEditing;
      const tempId = state.supplier.temp.temp_id;

      const url = isEditing
        ? `admin/setting/supplier/${tempId}`
        : "admin/setting/supplier";

      const method = isEditing ? "put" : "post";

      const response = await axios({
        method,
        url,
        data: data.form,
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      dispatch({ type: "supplier/saveSuccess", payload: response.data.data });
      dispatch(supplierActions.lists(data.search));
      return response.data;
    } catch (error) {
      dispatch({ type: "supplier/saveFailure", payload: error.response.data });
      throw error;
    }
  },

  show: id => async dispatch => {
    try {
      dispatch({ type: "supplier/showRequest" });
      const response = await axios.get(`admin/setting/supplier/show/${id}`);
      dispatch({ type: "supplier/showSuccess", payload: response.data.data });
      return response.data;
    } catch (error) {
      dispatch({ type: "supplier/showFailure", payload: error.response.data });
      throw error;
    }
  },

  destroy: data => async dispatch => {
    try {
      dispatch({ type: "supplier/destroyRequest" });
      await axios.delete(`admin/setting/supplier/${data.id}`);
      dispatch({ type: "supplier/destroySuccess" });
      dispatch(supplierActions.lists(data.search));
    } catch (error) {
      dispatch({
        type: "supplier/destroyFailure",
        payload: error.response.data
      });
      throw error;
    }
  },

  edit: id => async dispatch => {
    dispatch({ type: "supplier/edit", payload: id });
  },

  reset: () => async dispatch => {
    dispatch({ type: "supplier/reset" });
  }
};

export default supplierActions;
