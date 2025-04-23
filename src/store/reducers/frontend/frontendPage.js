const initialState = {
  lists: [],
  show: null,
  pageInfo: null,
  loading: false,
  error: null
};

export default function pageReducer(state = initialState, action) {
  switch (action.type) {
    case "FETCH_PAGES_REQUEST":
      return { ...state, loading: true, error: null };
    case "FETCH_PAGES_SUCCESS":
      return { ...state, loading: false, lists: action.payload };
    case "FETCH_PAGE_SUCCESS":
      return { ...state, loading: false, show: action.payload };
    case "FETCH_PAGE_INFO_SUCCESS":
      return { ...state, loading: false, pageInfo: action.payload };
    case "PAGE_FAILURE":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}
