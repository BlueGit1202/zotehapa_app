import axios from "axios";

export const fetchInitialVariation = payload => async dispatch => {
  try {
    const res = await axios.get(`admin/product/initial-variation/${payload}`);
    dispatch({ type: "SET_INITIAL_VARIATION", payload: res.data.data });
    return res;
  } catch (err) {
    throw err;
  }
};

export const fetchChildrenVariation = payload => async dispatch => {
  try {
    const res = await axios.get(`admin/product/children-variation/${payload}`);
    dispatch({ type: "SET_CHILDREN_VARIATION", payload: res.data.data });
    return res;
  } catch (err) {
    throw err;
  }
};

export const fetchAncestorsToString = payload => async dispatch => {
  try {
    const res = await axios.get(
      `admin/product/variation/ancestors-and-self/${payload}`
    );
    dispatch({ type: "SET_ANCESTORS_TO_STRING", payload: res.data.data });
    return res;
  } catch (err) {
    throw err;
  }
};
