export const fetchMenuTemplates = payload => async dispatch => {
  try {
    let url = "admin/setting/menu-template";
    if (payload) url += `?${new URLSearchParams(payload).toString()}`;
    const res = await axios.get(url);
    dispatch({ type: "MENU_TEMPLATE/SET_LISTS", payload: res.data });
    return res;
  } catch (err) {
    throw err;
  }
};
