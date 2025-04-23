const initialState = {
  lists: [],
  page: {},
  pagination: [],
  show: null,
  returnProducts: [],
  loading: false,
  error: null
};

export default function returnReducer(state = initialState, action) {
  switch (action.type) {
    case "RETURN_REQUEST":
      return { ...state, loading: true, error: null };
    case "FETCH_RETURNS_SUCCESS":
      return {
        ...state,
        loading: false,
        lists: action.payload.lists,
        page: action.payload.page,
        pagination: action.payload.pagination
      };
    case "FETCH_RETURN_SUCCESS":
      return {
        ...state,
        loading: false,
        show: action.payload.return,
        returnProducts: action.payload.products
      };
    case "RETURN_FAILURE":
      return { ...state, loading: false, error: action.payload };
      case 'GET_RETURN_ORDERS_REQUEST':
      return { ...state, loading: true };
    case 'GET_RETURN_ORDERS_SUCCESS':
      return { 
        ...state, 
        loading: false,
        lists: action.payload.data,
        pagination: action.payload.meta
      };
    case 'GET_RETURN_ORDERS_FAIL':
      return { ...state, loading: false, errors: action.payload };
      
    case 'GET_RETURN_ORDER_DETAILS_REQUEST':
      return { ...state, loading: true };
    case 'GET_RETURN_ORDER_DETAILS_SUCCESS':
      return { 
        ...state, 
        loading: false,
        show: action.payload.data,
        returnProducts: action.payload.data.return_products || []
      };
    case 'GET_RETURN_ORDER_DETAILS_FAIL':
      return { ...state, loading: false, error: action.payload };
      
    case 'SUBMIT_RETURN_REQUEST_REQUEST':
      return { ...state, loading: true };
    case 'SUBMIT_RETURN_REQUEST_SUCCESS':
      return { 
        ...state, 
        loading: false,
        error: null
      };
    case 'SUBMIT_RETURN_REQUEST_FAIL':
      return { 
        ...state, 
        loading: false, 
        error: action.payload.errors || action.payload.message 
      };
      
    case 'CLEAR_RETURN_ERRORS':
      return { ...state, error: null };
    default:
      return state;
  }
}
