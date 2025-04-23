export const fetchMyOrderDetails = payload => async dispatch => {
  try {
    const res = await axios.get(
      `admin/my-order/show/${payload.id}/${payload.orderId}`
    );
    dispatch({ type: "MY_ORDER_DETAILS/SET_DATA", payload: res.data });
    return res;
  } catch (err) {
    throw err;
  }
};
