const initialState = {
  lists: [],
  pagination: null,
  page: {},
  loading: false,
  error: null
};

export default function outletReducer(state = initialState, action) {
  switch (action.type) {
    case "FETCH_OUTLETS_REQUEST":
      return { ...state, loading: true, error: null };
    case "FETCH_OUTLETS_SUCCESS":
      return {
        ...state,
        loading: false,
        lists: action.payload.data,
        pagination: action.payload,
        page: action.payload.meta
      };
    case "OUTLET_FAILURE":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}
