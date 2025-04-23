import _ from "lodash";

export const addToCart = payload => async (dispatch, getState) => {
  const { lists } = getState().posCart;
  let isNew = false;
  let productMatch = false;

  if (lists.length === 0) {
    isNew = true;
  } else {
    _.forEach(lists, (list, listKey) => {
      if (
        list.product_id === payload.product_id &&
        list.variation_id === payload.variation_id
      ) {
        productMatch = true;
        if (payload.quantity + list.quantity <= list.stock) {
          dispatch(
            updateCartQuantity({
              id: listKey,
              status: list.quantity + payload.quantity
            })
          );
        } else {
          throw { message: "stockOut", status: false };
        }
      }
    });

    if (!productMatch) isNew = true;
  }

  if (isNew) {
    dispatch({
      type: "ADD_TO_CART",
      payload: {
        ...payload,
        total_tax: 0,
        subtotal: 0,
        total: 0,
        total_price: payload.total_price
      }
    });
  }

  dispatch(calculateCartTotals());
  return { data: getState().posCart.lists, status: true };
};

// ... (other cart actions from previous implementation)
