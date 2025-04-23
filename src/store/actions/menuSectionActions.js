export const fetchMenuSections = payload => async dispatch => {
  try {
    let url = "admin/setting/menu-section";
    if (payload) url += `?${new URLSearchParams(payload).toString()}`;
    const res = await axios.get(url);
    dispatch({ type: "MENU_SECTION/SET_LISTS", payload: res.data });
    return res;
  } catch (err) {
    throw err;
  }
};

export const resetMenuSectionTemp = () => ({ type: "MENU_SECTION/RESET_TEMP" });
