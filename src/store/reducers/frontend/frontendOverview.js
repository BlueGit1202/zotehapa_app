const initialState = {
  loading: false,
  totalOrders: 0,
  totalCompletedOrders: 0,
  totalReturnedOrders: 0,
  walletBalance: 0,
  orders: [],
};

export const frontendOverviewReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_TOTAL_ORDERS_REQUEST':
      return { ...state, loading: true };
    case 'GET_TOTAL_ORDERS_SUCCESS':
      return { ...state, loading: false, totalOrders: action.payload };
    case 'GET_TOTAL_ORDERS_FAIL':
      return { ...state, loading: false, error: action.payload };
      
    case 'GET_TOTAL_COMPLETED_ORDERS_REQUEST':
      return { ...state, loading: true };
    case 'GET_TOTAL_COMPLETED_ORDERS_SUCCESS':
      return { ...state, loading: false, totalCompletedOrders: action.payload };
    case 'GET_TOTAL_COMPLETED_ORDERS_FAIL':
      return { ...state, loading: false, error: action.payload };
      
    case 'GET_TOTAL_RETURNED_ORDERS_REQUEST':
      return { ...state, loading: true };
    case 'GET_TOTAL_RETURNED_ORDERS_SUCCESS':
      return { ...state, loading: false, totalReturnedOrders: action.payload };
    case 'GET_TOTAL_RETURNED_ORDERS_FAIL':
      return { ...state, loading: false, error: action.payload };
      
    case 'GET_WALLET_BALANCE_REQUEST':
      return { ...state, loading: true };
    case 'GET_WALLET_BALANCE_SUCCESS':
      return { ...state, loading: false, walletBalance: action.payload };
    case 'GET_WALLET_BALANCE_FAIL':
      return { ...state, loading: false, error: action.payload };
      
    case 'GET_ORDER_LISTS_REQUEST':
      return { ...state, loading: true };
    case 'GET_ORDER_LISTS_SUCCESS':
      return { ...state, loading: false, orders: action.payload };
    case 'GET_ORDER_LISTS_FAIL':
      return { ...state, loading: false, error: action.payload };
      
    default:
      return state;
  }
};