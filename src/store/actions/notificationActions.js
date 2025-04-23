export const fetchNotifications = () => async dispatch => {
  try {
    const res = await axios.get("admin/setting/notification");
    dispatch({ type: "NOTIFICATION/SET_LISTS", payload: res.data.data });
    return res;
  } catch (err) {
    throw err;
  }
};

export const saveNotificationSettings = payload => async dispatch => {
  try {
    const res = await axios.put("admin/setting/notification", payload);
    dispatch({ type: "NOTIFICATION/SET_LISTS", payload });
    return res;
  } catch (err) {
    throw err;
  }
};
