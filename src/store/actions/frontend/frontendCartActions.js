import _ from 'lodash';

export const listChecker = () => {
  return (dispatch, getState) => {
    const { lists } = getState().frontendCart;
    return Promise.resolve({
      status: lists.length > 0
    });
  };
};

export const addToCart = (payload) => {
  return (dispatch, getState) => {
    const { frontendCart, frontendSetting, frontendOrderArea } = getState();
    
    return new Promise((resolve, reject) => {
      try {
        let newLists = [...frontendCart.lists];
        let isNew = false;
        let productMatch = false;

        if (newLists.length === 0) {
          isNew = true;
        } else {
          newLists.forEach((list, listKey) => {
            if (list.product_id === payload.product_id && list.variation_id === payload.variation_id) {
              productMatch = true;
              if ((payload.quantity + list.quantity) <= list.stock) {
                newLists[listKey].quantity += payload.quantity;
              } else {
                return reject({
                  message: "stockOut",
                  status: false
                });
              }
            }
          });

          if (!productMatch) {
            isNew = true;
          }
        }

        if (isNew) {
          newLists.push({
            name: payload.name,
            product_id: payload.product_id,
            image: payload.image,
            variation_names: payload.variation_names,
            variation_id: payload.variation_id,
            sku: payload.sku,
            stock: payload.stock,
            taxes: payload.taxes,
            shipping: payload.shipping,
            quantity: payload.quantity,
            discount: payload.discount,
            price: payload.price,
            old_price: payload.old_price,
            total_tax: 0,
            subtotal: 0,
            total: 0,
            total_price: payload.total_price
          });
        }

        dispatch({
          type: 'UPDATE_CART',
          payload: {
            lists: newLists,
            setting: frontendSetting.lists,
            area: frontendOrderArea.lists
          }
        });

        resolve({ data: newLists, status: true });
      } catch (error) {
        reject(error);
      }
    });
  };
};

export const updateQuantity = (id, quantity) => {
  return (dispatch, getState) => {
    const { frontendCart, frontendSetting, frontendOrderArea } = getState();
    
    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: { id, quantity, setting: frontendSetting.lists, area: frontendOrderArea.lists }
    });
  };
};

export const removeFromCart = (id) => {
  return (dispatch, getState) => {
    const { frontendCart, frontendSetting, frontendOrderArea } = getState();
    
    dispatch({
      type: 'REMOVE_FROM_CART',
      payload: { id, setting: frontendSetting.lists, area: frontendOrderArea.lists }
    });
  };
};

export const applyCoupon = (coupon) => {
  return (dispatch) => {
    dispatch({
      type: 'APPLY_COUPON',
      payload: coupon
    });
  };
};

export const removeCoupon = () => {
  return (dispatch) => {
    dispatch({ type: 'REMOVE_COUPON' });
  };
};

export const initOrderType = (orderType) => {
  return (dispatch, getState) => {
    const { frontendSetting, frontendOrderArea } = getState();
    
    dispatch({
      type: 'INIT_ORDER_TYPE',
      payload: { order_type: orderType, setting: frontendSetting.lists, area: frontendOrderArea.lists }
    });
  };
};

export const updateOrderType = (orderType) => {
  return (dispatch, getState) => {
    const { frontendSetting, frontendOrderArea } = getState();
    
    dispatch({
      type: 'UPDATE_ORDER_TYPE',
      payload: { orderType, setting: frontendSetting.lists, area: frontendOrderArea.lists }
    });
  };
};

export const updateShippingAddress = (address) => {
  return (dispatch, getState) => {
    const { frontendSetting, frontendOrderArea } = getState();
    
    dispatch({
      type: 'UPDATE_SHIPPING_ADDRESS',
      payload: { address, setting: frontendSetting.lists, area: frontendOrderArea.lists }
    });
  };
};

export const updateBillingAddress = (address) => {
  return (dispatch) => {
    dispatch({
      type: 'UPDATE_BILLING_ADDRESS',
      payload: address
    });
  };
};

export const updateOutletAddress = (address) => {
  return (dispatch) => {
    dispatch({
      type: 'UPDATE_OUTLET_ADDRESS',
      payload: address
    });
  };
};

export const updatePaymentMethod = (method) => {
  return (dispatch) => {
    dispatch({
      type: 'UPDATE_PAYMENT_METHOD',
      payload: method
    });
  };
};

export const resetCart = () => {
  return (dispatch) => {
    dispatch({ type: 'RESET_CART' });
  };
};