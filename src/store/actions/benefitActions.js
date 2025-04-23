import axios from "axios";
import appService from "../../../services/appService";

export const benefitActions = {
  lists: payload => async dispatch => {
    try {
      let url = "admin/setting/benefit";
      if (payload) {
        url = url + appService.requestHandler(payload);
      }
      const res = await axios.get(url);

      dispatch({
        type: "BENEFIT_LISTS",
        payload: res.data
      });

      return Promise.resolve(res.data);
    } catch (err) {
      return Promise.reject(err);
    }
  },

  save: payload => async (dispatch, getState) => {
    try {
      const { temp } = getState().benefit;
      let method = axios.post;
      let url = "/admin/setting/benefit";

      if (temp.isEditing) {
        method = axios.post;
        url = `/admin/setting/benefit/${temp.temp_id}`;
      }

      const formData = new FormData();
      formData.append("title", payload.form.title);
      formData.append("status", payload.form.status);
      formData.append("description", payload.form.description);

      if (payload.form.image) {
        formData.append("image", {
          uri: payload.form.image.uri,
          type: payload.form.image.type || "image/jpeg",
          name: payload.form.image.fileName || "image.jpg"
        });
      }

      const res = await method(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      dispatch(benefitActions.lists(payload.search));
      dispatch({ type: "BENEFIT_RESET" });

      return Promise.resolve(res.data);
    } catch (err) {
      return Promise.reject(err);
    }
  },

  edit: payload => dispatch => {
    dispatch({
      type: "BENEFIT_TEMP",
      payload
    });
  },

  destroy: payload => async dispatch => {
    try {
      const res = await axios.delete(`admin/setting/benefit/${payload.id}`);
      dispatch(benefitActions.lists(payload.search));
      return Promise.resolve(res.data);
    } catch (err) {
      return Promise.reject(err);
    }
  },

  show: payload => async dispatch => {
    try {
      const res = await axios.get(`admin/setting/benefit/show/${payload}`);
      dispatch({
        type: "BENEFIT_SHOW",
        payload: res.data
      });
      return Promise.resolve(res.data);
    } catch (err) {
      return Promise.reject(err);
    }
  },

  reset: () => dispatch => {
    dispatch({ type: "BENEFIT_RESET" });
  }
};
