const initialState = {
  lists: {}
};

export const shippingSetupReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SHIPPING_SETUP_LISTS":
      return {
        ...state,
        lists: action.payload
      };
    default:
      return state;
  }
};
