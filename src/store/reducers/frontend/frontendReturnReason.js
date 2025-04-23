const initialState = {
  lists: [],
  loading: false,
  error: null
};

export default function returnReasonReducer(state = initialState, action) {
  switch (action.type) {
    case "REASON_REQUEST":
      return { ...state, loading: true, error: null };
    case "FETCH_REASONS_SUCCESS":
      return { ...state, loading: false, lists: action.payload };
    case "REASON_FAILURE":
      return { ...state, loading: false, error: action.payload };
      case 'GET_RETURN_REASONS_REQUEST':
      return { ...state, loading: true };
    case 'GET_RETURN_REASONS_SUCCESS':
      return { 
        ...state, 
        loading: false,
        lists: action.payload.data
      };
    case 'GET_RETURN_REASONS_FAIL':
      return { ...state, loading: false, errors: action.payload };
    default:
      return state;
  }
}
