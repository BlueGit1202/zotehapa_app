const initialState = {
  lists: [],
  show: null,
  loading: false,
  error: null
};

const frontendCountryCodeReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_COUNTRY_CODES_REQUEST":
      return { ...state, loading: true, error: null };
    case "FETCH_COUNTRY_CODES_SUCCESS":
      return { ...state, loading: false, lists: action.payload };
    case "FETCH_COUNTRY_CODE_SUCCESS":
      return { ...state, loading: false, show: action.payload };
    case "FETCH_CALLING_CODE_SUCCESS":
      return { ...state, loading: false, show: action.payload };
    case "COUNTRY_CODE_FAILURE":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default frontendCountryCodeReducer;
