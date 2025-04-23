// Actions
export const fetchTimezones = () => async dispatch => {
  try {
    const res = await axios.get("admin/timezone");
    dispatch({ type: "SET_TIMEZONES", payload: res.data.data });
    return res;
  } catch (err) {
    throw err;
  }
};
