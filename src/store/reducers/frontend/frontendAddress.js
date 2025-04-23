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

export const frontendAddressReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_FRONTEND_ADDRESS_LISTS":
      return {
        ...state,
        lists: action.payload.data,
        pagination: action.payload.data,
        page: action.payload.data
      };
    case "SET_FRONTEND_ADDRESS_TEMP":
      return {
        ...state,
        temp: {
          temp_id: action.payload,
          isEditing: true
        }
      };
    case "RESET_FRONTEND_ADDRESS":
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
