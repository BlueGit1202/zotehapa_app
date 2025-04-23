const initialState = {
  lists: [],
  loading: false,
  error: null
};

export default function paymentGatewayReducer(state = initialState, action) {
  switch (action.type) {
    case "FETCH_PAYMENT_GATEWAYS_REQUEST":
      return { ...state, loading: true, error: null };
    case "FETCH_PAYMENT_GATEWAYS_SUCCESS":
      return { ...state, loading: false, lists: action.payload };
    case "PAYMENT_GATEWAY_FAILURE":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}
