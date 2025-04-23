const initialState = {
  lists: [],
  show: null,
  loading: false,
  error: null
};

export default function languageReducer(state = initialState, action) {
  switch (action.type) {
    case "FETCH_LANGUAGES_REQUEST":
      return { ...state, loading: true, error: null };
    case "FETCH_LANGUAGES_SUCCESS":
      return { ...state, loading: false, lists: action.payload };
    case "FETCH_LANGUAGE_SUCCESS":
      return { ...state, loading: false, show: action.payload };
    case "LANGUAGE_FAILURE":
      return { ...state, loading: false, error: action.payload };
      
    default:
      return state;
  }
}
