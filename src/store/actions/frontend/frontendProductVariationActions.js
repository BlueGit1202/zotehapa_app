import axios from "axios";

export const fetchInitialVariation = id => async dispatch => {
  try {
    dispatch({ type: "VARIATION_REQUEST" });
    const res = await axios.get(`frontend/product/initial-variation/${id}`);
    dispatch({
      type: "FETCH_INITIAL_VARIATION_SUCCESS",
      payload: res.data.data
    });
    return res.data;
  } catch (error) {
    dispatch({ type: "VARIATION_FAILURE", payload: error.message });
    throw error;
  }
};

export const fetchChildrenVariation = id => async dispatch => {
  try {
    dispatch({ type: "VARIATION_REQUEST" });
    const res = await axios.get(`frontend/product/children-variation/${id}`);
    dispatch({
      type: "FETCH_CHILDREN_VARIATION_SUCCESS",
      payload: res.data.data
    });
    return res.data;
  } catch (error) {
    dispatch({ type: "VARIATION_FAILURE", payload: error.message });
    throw error;
  }
};

export const fetchAncestorsString = id => async dispatch => {
  try {
    dispatch({ type: "VARIATION_REQUEST" });
    const res = await axios.get(
      `frontend/product/variation/ancestors-and-self/${id}`
    );
    dispatch({
      type: "FETCH_ANCESTORS_STRING_SUCCESS",
      payload: res.data.data
    });
    return res.data;
  } catch (error) {
    dispatch({ type: "VARIATION_FAILURE", payload: error.message });
    throw error;
  }
};
