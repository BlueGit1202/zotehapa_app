const initialState = {
  initialVariation: [],
  childrenVariation: [],
  ancestorsToString: "",
  loading: false,
  error: null
};

export default function productVariationReducer(state = initialState, action) {
  switch (action.type) {
    case "VARIATION_REQUEST":
      return { ...state, loading: true, error: null };
    case "FETCH_INITIAL_VARIATION_SUCCESS":
      return { ...state, loading: false, initialVariation: action.payload };
    case "FETCH_CHILDREN_VARIATION_SUCCESS":
      return { ...state, loading: false, childrenVariation: action.payload };
    case "FETCH_ANCESTORS_STRING_SUCCESS":
      return { ...state, loading: false, ancestorsToString: action.payload };
    case "VARIATION_FAILURE":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}
