const initialState = {
  lists: [],
  page: {},
  pagination: [],
  show: {},
  returnProducts: {},
  returnOrderUser: {},
  temp: {
    temp_id: null,
    isEditing: false
  }
};

export const returnAndRefundReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_RETURN_AND_REFUND_LISTS":
      return {
        ...state,
        lists: action.payload.data,
        page: action.payload.meta,
        pagination: action.payload
      };
    case "SET_RETURN_AND_REFUND_SHOW":
      return {
        ...state,
        show: action.payload.data,
        returnProducts: action.payload.data.return_products,
        returnOrderUser: action.payload.data.user
      };
    case "UPDATE_RETURN_AND_REFUND_STATUS":
      return {
        ...state,
        show: action.payload.data
      };
    case "RESET_RETURN_AND_REFUND_TEMP":
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
