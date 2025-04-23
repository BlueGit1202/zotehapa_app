const initialState = {
  lists: [],
  loading: false,
  errors: {}
};

export const paymentGatewayReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_PAYMENT_GATEWAYS":
      return {
        ...state,
        lists: action.payload,
        loading: false
      };
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload
      };
    case "SET_ERRORS":
      return {
        ...state,
        errors: action.payload
      };
    default:
      return state;
  }
};
