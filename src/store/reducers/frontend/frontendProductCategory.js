const initialState = {
  ancestorsAndSelf: [],
  trees: [],
  lists: [],
  loading: false,
  error: null
};

export default function productCategoryReducer(state = initialState, action) {
  switch (action.type) {
    case "FETCH_CATEGORIES_REQUEST":
      return { ...state, loading: true, error: null };
    case "FETCH_CATEGORY_ANCESTORS_SUCCESS":
      return { ...state, loading: false, ancestorsAndSelf: action.payload };
    case "FETCH_CATEGORY_TREES_SUCCESS":
      return { ...state, loading: false, trees: action.payload };
    case "FETCH_CATEGORIES_SUCCESS":
      return { ...state, loading: false, lists: action.payload };
    case "CATEGORY_FAILURE":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}
