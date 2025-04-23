const initialState = {
  loading: false,
  show: {},
  orderProducts: [],
  errors: null
};

export const frontendOrderReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_ORDER_DETAILS_REQUEST':
      return { ...state, loading: true };
    case 'GET_ORDER_DETAILS_SUCCESS':
      return { 
        ...state, 
        loading: false,
        show: action.payload.data,
        orderProducts: action.payload.data.products.map(p => ({
          ...p,
          isReturn: false,
          quantity: 1
        }))
      };
    case 'GET_ORDER_DETAILS_FAIL':
      return { ...state, loading: false, errors: action.payload };
      
    case 'UPDATE_ORDER_PRODUCTS':
      return {
        ...state,
        orderProducts: action.payload
      };
      
    default:
      return state;
  }
};