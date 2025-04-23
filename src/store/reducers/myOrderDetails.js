const initialState = {
  orderDetails: {},
  orderProducts: {},
  orderUser: {},
  orderAddresses: {},
  outletAddress: {}
};

export const myOrderDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "MY_ORDER_DETAILS/SET_DATA":
      return {
        ...state,
        orderDetails: action.payload.data,
        orderProducts: action.payload.data.order_products,
        orderUser: action.payload.data.user,
        orderAddresses: action.payload.data.order_address,
        outletAddress: action.payload.data.outlet_address
      };
    default:
      return state;
  }
};
