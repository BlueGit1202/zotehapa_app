const initialState = {
  lists: [],
  page: {},
  pagination: [],
  temp: {
    temp_id: null,
    isEditing: false
  }
};

export const currencyReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CURRENCY_LISTS":
      return {
        ...state,
        lists: action.payload.data,
        page: action.payload.meta,
        pagination: action.payload
      };
    case "CURRENCY_TEMP":
      return {
        ...state,
        temp: {
          temp_id: action.payload,
          isEditing: true
        }
      };
    case "CURRENCY_RESET":
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
