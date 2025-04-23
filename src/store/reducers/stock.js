const initialState = {
  lists: [],
  page: {},
  pagination: [],
  show: {},
  temp: {
    temp_id: null,
    isEditing: false
  }
};

export const stockReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_STOCK_LISTS":
      return {
        ...state,
        lists: action.payload.data,
        page: action.payload.meta,
        pagination: action.payload
      };
    case "SET_STOCK_TEMP":
      return {
        ...state,
        temp: {
          temp_id: action.payload,
          isEditing: true
        }
      };
    case "RESET_STOCK":
      return {
        ...state,
        temp: {
          temp_id: null,
          isEditing: false
        }
      };
    case "SET_STOCK_SHOW":
      return {
        ...state,
        show: action.payload
      };
    default:
      return state;
  }
};
