const initialState = {
  lists: [],
  page: {},
  pagination: [],
  temp: {
    temp_id: null,
    isEditing: false
  }
};

export const transactionReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_TRANSACTION_LISTS":
      return {
        ...state,
        lists: action.payload.data,
        page: action.payload.meta,
        pagination: action.payload
      };
    case "RESET_TRANSACTION":
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
