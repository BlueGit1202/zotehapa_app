import axios from "axios";

export const fetchAncestorsAndSelf = payload => async dispatch => {
  try {
    const res = await axios.get(
      `admin/setting/product-category/ancestors-and-self/${payload}`
    );
    dispatch({ type: "SET_ANCESTORS_AND_SELF", payload: res.data.data });
    return res;
  } catch (err) {
    throw err;
  }
};

export const fetchCategoryTrees = () => async dispatch => {
  try {
    const res = await axios.get(`admin/setting/product-category/tree`);
    dispatch({ type: "SET_CATEGORY_TREES", payload: res.data });
    return res;
  } catch (err) {
    throw err;
  }
};

export const fetchCategories = payload => async dispatch => {
  try {
    let url = "admin/setting/product-category";
    if (payload) url += appService.requestHandler(payload);

    const res = await axios.get(url);
    dispatch({ type: "SET_CATEGORY_LISTS", payload: res.data.data });
    return res;
  } catch (err) {
    throw err;
  }
};
