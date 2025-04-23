const initialState = {
  lists: [],
  page: {},
  pagination: [],
  show: {},
  orderProducts: {},
  orderUser: {},
  orderAddress: {},
  outletAddress: {},
  temp: {
    temp_id: null,
    isEditing: false
  }
};

export const onlineOrderReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_ONLINE_ORDER_LISTS":
      return {
        ...state,
        lists: action.payload
      };
    case "SET_ONLINE_ORDER_PAGINATION":
      return {
        ...state,
        pagination: action.payload
      };
    case "SET_ONLINE_ORDER_PAGE":
      return {
        ...state,
        page: {
          from: action.payload.from,
          to: action.payload.to,
          total: action.payload.total
        }
      };
    case "SET_ONLINE_ORDER_SHOW":
      return {
        ...state,
        show: action.payload
      };
    case "SET_ONLINE_ORDER_PRODUCTS":
      return {
        ...state,
        orderProducts: action.payload
      };
    case "SET_ONLINE_ORDER_USER":
      return {
        ...state,
        orderUser: action.payload
      };
    case "SET_ONLINE_ORDER_ADDRESS":
      return {
        ...state,
        orderAddress: action.payload
      };
    case "SET_ONLINE_ORDER_OUTLET_ADDRESS":
      return {
        ...state,
        outletAddress: action.payload
      };
    case "RESET_ONLINE_ORDER_TEMP":
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
