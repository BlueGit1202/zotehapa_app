import axios from "axios";

export const listPromotionProducts = payload => async dispatch => {
  try {
    let url = `admin/promotion/product/${payload.id}`;
    if (payload) {
      url += `?${Object.keys(payload)
        .map(key => `${key}=${payload[key]}`)
        .join("&")}`;
    }
    const res = await axios.get(url);
    dispatch({ type: "PROMOTION_PRODUCT_LIST", payload: res.data });
    return res;
  } catch (err) {
    throw err;
  }
};

export const savePromotionProduct = payload => async dispatch => {
  try {
    const res = await axios.post(
      `admin/promotion/product/${payload.id}`,
      payload.form
    );
    dispatch(listPromotionProducts(payload.search));
    return res;
  } catch (err) {
    throw err;
  }
};

export const destroyPromotionProduct = payload => async dispatch => {
  try {
    const res = await axios.delete(
      `admin/promotion/product/${payload.promotion}/${payload.id}`
    );
    dispatch(listPromotionProducts(payload.search));
    return res;
  } catch (err) {
    throw err;
  }
};

export const resetPromotionProduct = () => ({
  type: "PROMOTION_PRODUCT_RESET"
});
