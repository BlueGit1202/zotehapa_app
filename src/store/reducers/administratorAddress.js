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

export const administratorAddressReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_ADMINISTRATOR_ADDRESS_LISTS":
      return {
        ...state,
        lists: action.payload
      };
    case "SET_ADMINISTRATOR_ADDRESS_PAGINATION":
      return {
        ...state,
        pagination: action.payload
      };
    case "SET_ADMINISTRATOR_ADDRESS_PAGE":
      return {
        ...state,
        page: {
          from: action.payload.from,
          to: action.payload.to,
          total: action.payload.total
        }
      };
    case "SET_ADMINISTRATOR_ADDRESS_SHOW":
      return {
        ...state,
        show: action.payload
      };
    case "SET_ADMINISTRATOR_ADDRESS_TEMP":
      return {
        ...state,
        temp: {
          temp_id: action.payload,
          isEditing: true
        }
      };
    case "RESET_ADMINISTRATOR_ADDRESS":
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
