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

export const administratorReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_ADMINISTRATOR_LISTS":
      return {
        ...state,
        lists: action.payload
      };
    case "SET_ADMINISTRATOR_PAGINATION":
      return {
        ...state,
        pagination: action.payload
      };
    case "SET_ADMINISTRATOR_PAGE":
      return {
        ...state,
        page: {
          from: action.payload.from,
          to: action.payload.to,
          total: action.payload.total
        }
      };
    case "SET_ADMINISTRATOR_SHOW":
      return {
        ...state,
        show: action.payload
      };
    case "SET_ADMINISTRATOR_TEMP":
      return {
        ...state,
        temp: {
          temp_id: action.payload,
          isEditing: true
        }
      };
    case "SET_ADMINISTRATOR_MY_ORDERS":
      return {
        ...state,
        myOrders: action.payload
      };
    case "SET_ADMINISTRATOR_ORDER_PAGINATION":
      return {
        ...state,
        orderPagination: action.payload
      };
    case "SET_ADMINISTRATOR_ORDER_PAGE":
      return {
        ...state,
        orderPage: {
          from: action.payload.from,
          to: action.payload.to,
          total: action.payload.total
        }
      };
    case "RESET_ADMINISTRATOR":
      return {
        ...state,
        temp: {
          temp_id: null,
          isEditing: false
        }
      };
    default:
      return state;
  }
};
