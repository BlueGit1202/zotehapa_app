const initialState = {
  lists: [],
  loading: false,
  error: null
};

export default function productBrandReducer(state = initialState, action) {
  switch (action.type) {
    case "FETCH_BRANDS_REQUEST":
      return { ...state, loading: true, error: null };
    case "FETCH_BRANDS_SUCCESS":
      return { ...state, loading: false, lists: action.payload };
    case "BRAND_FAILURE":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}
