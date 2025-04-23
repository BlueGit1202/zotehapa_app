import axios from "axios";
import appService from "../../../../services/appService";

export const fetchCategoryAncestors = id => async dispatch => {
  try {
    dispatch({ type: "FETCH_CATEGORIES_REQUEST" });
    const res = await axios.get(
      `frontend/product-category/ancestors-and-self/${id}`
    );
    dispatch({
      type: "FETCH_CATEGORY_ANCESTORS_SUCCESS",
      payload: res.data.data
    });
    return res.data;
  } catch (error) {
    dispatch({ type: "CATEGORY_FAILURE", payload: error.message });
    throw error;
  }
};

export const fetchCategoryTrees = () => async dispatch => {
  try {
    dispatch({ type: "FETCH_CATEGORIES_REQUEST" });
    const res = await axios.get("frontend/product-category/tree");
    dispatch({ type: "FETCH_CATEGORY_TREES_SUCCESS", payload: res.data });
    return res.data;
  } catch (error) {
    dispatch({ type: "CATEGORY_FAILURE", payload: error.message });
    throw error;
  }
};

export const fetchCategories = (payload = {}) => async dispatch => {
  try {
    dispatch({ type: "FETCH_CATEGORIES_REQUEST" });
    let url = "frontend/product-category";
    if (payload) url += appService.requestHandler(payload);
    const res = await axios.get(url);
    dispatch({ type: "FETCH_CATEGORIES_SUCCESS", payload: res.data.data });
    return res.data;
  } catch (error) {
    dispatch({ type: "CATEGORY_FAILURE", payload: error.message });
    throw error;
  }
};
