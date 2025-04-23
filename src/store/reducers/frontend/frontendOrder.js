const initialState = {
  loading: false,
  error: null,
  lists: [],
  page: {
    from: 0,
    to: 0,
    total: 0
  },
  pagination: [],
  show: {},
  orderProducts: {},
  orderUser: {},
  orderAddress: {},
  outletAddress: {}
};

export const frontendOrderReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_ORDER_DETAILS_REQUEST":
      return {
        ...state,
        loading: true,
        error: null
      };
      
    case "GET_ORDER_DETAILS_SUCCESS":
      return {
        ...state,
        loading: false,
        show: action.payload.data,
        orderProducts: action.payload.data.order_products,
        orderUser: action.payload.data.user,
        orderAddress: action.payload.data.order_address,
        outletAddress: action.payload.data.outlet_address
      };
      
    case "GET_ORDER_DETAILS_FAIL":
      return {
        ...state,
        loading: false,
        error: action.payload
      };
      
    case "SET_ORDER_LISTS":
      return {
        ...state,
        lists: action.payload.data
      };
      
    case "SET_ORDER_PAGINATION":
      return {
        ...state,
        pagination: action.payload,
        page: {
          from: action.payload.meta?.from || 0,
          to: action.payload.meta?.to || 0,
          total: action.payload.meta?.total || 0
        }
      };
      
    case "SET_ORDER_DETAILS":
      return {
        ...state,
        show: action.payload.data,
        orderProducts: action.payload.data.order_products,
        orderUser: action.payload.data.user,
        orderAddress: action.payload.data.order_address,
        outletAddress: action.payload.data.outlet_address
      };
      
    case "UPDATE_ORDER_STATUS":
      return {
        ...state,
        show: action.payload.data
      };
      
    case "UPDATE_ORDER_PRODUCTS":
      return {
        ...state,
        orderProducts: action.payload
      };
      
    case "CLEAR_ORDER_DETAILS":
      return {
        ...state,
        show: {},
        orderProducts: {},
        orderUser: {},
        orderAddress: {},
        outletAddress: {}
      };
      
    default:
      return state;
  }
};