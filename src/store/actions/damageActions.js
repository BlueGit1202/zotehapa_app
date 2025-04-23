import appService from "../../../services/appService";
export const damageActions = {
  lists: payload => async dispatch => {
    try {
      let url = "admin/damage";
      if (payload) {
        url = url + appService.requestHandler(payload);
      }
      const res = await axios.get(url);
      dispatch({ type: "DAMAGE_LISTS", payload: res.data });
      return res;
    } catch (err) {
      throw err;
    }
  },
  save: payload => async (dispatch, getState) => {
    try {
      const { temp } = getState().damage;
      let method = axios.post;
      let url = "admin/damage";
      if (temp.isEditing) {
        method = axios.post;
        url = `admin/damage/update/${temp.temp_id}`;
      }

      const res = await method(url, payload.form);
      dispatch(damageActions.lists({ vuex: true }));
      dispatch({ type: "DAMAGE_RESET" });
      return res;
    } catch (err) {
      throw err;
    }
  },
  show: payload => async dispatch => {
    try {
      const res = await axios.get(`admin/damage/show/${payload}`);
      dispatch({ type: "DAMAGE_SHOW", payload: res.data });
      return res;
    } catch (err) {
      throw err;
    }
  },
  edit: payload => async dispatch => {
    try {
      const res = await axios.get(`admin/damage/edit/${payload}`);
      dispatch({
        type: "DAMAGE_EDIT",
        payload: { data: res.data.data, id: payload }
      });
      return res;
    } catch (err) {
      throw err;
    }
  },
  destroy: payload => async dispatch => {
    try {
      const res = await axios.delete(`admin/damage/${payload.id}`);
      dispatch(damageActions.lists(payload.search));
      return res;
    } catch (err) {
      throw err;
    }
  },
  export: payload => async () => {
    try {
      let url = "admin/damage/export";
      if (payload) {
        url = url + appService.requestHandler(payload);
      }
      const res = await axios.get(url, { responseType: "blob" });
      return res;
    } catch (err) {
      throw err;
    }
  },
  download: payload => async () => {
    try {
      const res = await axios.get(
        `admin/damage/download-attachment/${payload}`,
        { responseType: "blob" }
      );
      return res;
    } catch (err) {
      throw err;
    }
  },
  reset: () => ({ type: "DAMAGE_RESET" })
};
