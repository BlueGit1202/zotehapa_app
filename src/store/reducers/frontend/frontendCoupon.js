const initialState = {
  lists: [],
  show: null,
  loading: false,
  error: null
};

const couponReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_COUPONS_REQUEST":
      return { ...state, loading: true, error: null };
    case "FETCH_COUPONS_SUCCESS":
      return { ...state, loading: false, lists: action.payload };
    case "FETCH_COUPON_SUCCESS":
      return { ...state, loading: false, show: action.payload };
    case "COUPON_CHECKING_REQUEST":
      return { ...state, loading: true };
    case "COUPON_FAILURE":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default couponReducer;
