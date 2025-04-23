const initialState = {
  lists: [],
  page: {},
  pagination: [],
  show: {},
  temp: {
    temp_id: null,
    isEditing: false
  },
  myOrders: [],
  orderPage: {},
  orderPagination: []
};

export const customerReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_CUSTOMER_LISTS":
      return {
        ...state,
        lists: action.payload
      };
    case "SET_CUSTOMER_PAGINATION":
      return {
        ...state,
        pagination: action.payload
      };
    case "SET_CUSTOMER_PAGE":
      return {
        ...state,
        page: {
          from: action.payload.from,
          to: action.payload.to,
          total: action.payload.total
        }
      };
    case "SET_CUSTOMER_MY_ORDERS":
      return {
        ...state,
        myOrders: action.payload
      };
    case "SET_CUSTOMER_ORDER_PAGINATION":
      return {
        ...state,
        orderPagination: action.payload
      };
    case "SET_CUSTOMER_ORDER_PAGE":
      return {
        ...state,
        orderPage: {
          from: action.payload.from,
          to: action.payload.to,
          total: action.payload.total
        }
      };
    case "SET_CUSTOMER_SHOW":
      return {
        ...state,
        show: action.payload
      };
    case "SET_CUSTOMER_TEMP":
      return {
        ...state,
        temp: {
          temp_id: action.payload,
          isEditing: true
        }
      };
    case "RESET_CUSTOMER":
      return {
        ...state,
        temp: {
          temp_id: null,
          isEditing: false
        },
        show:{}
      };
    default:
      return state;
  }
};
