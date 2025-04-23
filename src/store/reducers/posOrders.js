const initialState = {
  orders: [],
  order: null,
  orderProducts: [],
  orderUser: null,
  pagination: {
    current_page: 1,
    last_page: 1,
    from: 1,
    to: 1,
    total: 0,
    per_page: 10
  },
  loading: false,
  error: null
};

export const posOrderReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_POS_ORDERS_REQUEST':
    case 'FETCH_POS_ORDER_REQUEST':
    case 'DELETE_POS_ORDER_REQUEST':
    case 'CHANGE_ORDER_STATUS_REQUEST':
    case 'CHANGE_PAYMENT_STATUS_REQUEST':
    case 'EXPORT_POS_ORDERS_REQUEST':
      return { ...state, loading: true, error: null };
    
    case 'FETCH_POS_ORDERS_SUCCESS':
      return {
        ...state,
        loading: false,
        orders: action.payload.data,
        pagination: {
          ...state.pagination,
          current_page: action.payload.pagination.current_page,
          last_page: action.payload.pagination.last_page,
          from: action.payload.pagination.from,
          to: action.payload.pagination.to,
          total: action.payload.pagination.total,
          per_page: action.payload.pagination.per_page
        }
      };
    
    case 'FETCH_POS_ORDER_SUCCESS':
      return {
        ...state,
        loading: false,
        order: action.payload,
        orderProducts: action.payload.order_products,
        orderUser: action.payload.user
      };
    
    case 'DELETE_POS_ORDER_SUCCESS':
      return {
        ...state,
        loading: false,
        orders: state.orders.filter(order => order.id !== action.payload)
      };
    
    case 'CHANGE_ORDER_STATUS_SUCCESS':
    case 'CHANGE_PAYMENT_STATUS_SUCCESS':
      return {
        ...state,
        loading: false,
        order: action.payload
      };
    
    case 'FETCH_POS_ORDERS_FAILURE':
    case 'FETCH_POS_ORDER_FAILURE':
    case 'DELETE_POS_ORDER_FAILURE':
    case 'CHANGE_ORDER_STATUS_FAILURE':
    case 'CHANGE_PAYMENT_STATUS_FAILURE':
    case 'EXPORT_POS_ORDERS_FAILURE':
      return { ...state, loading: false, error: action.payload };
    
    default:
      return state;
  }
};