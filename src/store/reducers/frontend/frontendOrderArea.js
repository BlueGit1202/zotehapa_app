const initialState = {
  lists: [],
  loading: false,
  error: null
};

export default function orderAreaReducer(state = initialState, action) {
  switch (action.type) {
    case "FETCH_ORDER_AREAS_REQUEST":
      return { ...state, loading: true, error: null };
    case "FETCH_ORDER_AREAS_SUCCESS":
      return { ...state, loading: false, lists: action.payload };
    case "ORDER_AREA_FAILURE":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}
