import axios from "axios";

export const fetchPermissions = (payload) => async (dispatch) => {
  try {
    const res = await axios.get(`admin/setting/permission/${payload}`);
    if (!payload?.vuex || payload.vuex === true) {
      dispatch({ type: "SET_PERMISSION_LISTS", payload: res.data.data });
    }
    return res;
  } catch (err) {
    throw err;
  }
};

export const savePermissions = (payload) => async () => {
  try {
    return await axios.put(`admin/setting/permission/${payload.id}`, {
      permissions: payload.form
    });
  } catch (err) {
    throw err;
  }
};