import axios from "axios";
import appService from "../../../../services/appService";

export const fetchWishlist = payload => async dispatch => {
  try {
    let url = "frontend/wishlist";
    if (payload) {
      url = url + appService.requestHandler(payload);
    }
    const response = await axios.get(url, payload);
    dispatch({
      type: "FETCH_WISHLIST_SUCCESS",
      payload: response.data.data,
    });
  } catch (error) {
    dispatch({
      type: "FETCH_WISHLIST_FAILURE",
      payload: error.message,
    });
    throw error;
  }
};

export const fetchWishlistProducts = (
  page = 1,
  perPage = 32
) => async dispatch => {
  try {
    const response = await axios.get(
      `frontend/wishlist?page=${page}&per_page=${perPage}&paginate=1`
    );
    dispatch({
      type: "SET_WISHLIST_PRODUCTS",
      payload: response.data,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching wishlist products:", error);
    throw error;
  }
};

export const toggleWishlist = payload => async dispatch => {
  try {
    const response = await axios.post("frontend/wishlist/toggle", payload);
    console.log("toggled product", response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const resetWishlist = () => dispatch => {
  dispatch({ type: "RESET_WISHLIST" });
};
