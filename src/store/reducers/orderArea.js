const initialState = {
  lists: [],
  page: {},
  pagination: [],
  temp: {
    temp_id: null,
    isEditing: false
  }
};

export const orderAreaReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ORDER_AREA_LISTS":
      return {
        ...state,
        lists: action.payload.data,
        page: action.payload.meta,
        pagination: action.payload
      };
    case "ORDER_AREA_TEMP":
      return {
        ...state,
        temp: {
          temp_id: action.payload,
          isEditing: true
        }
      };
    case "ORDER_AREA_RESET":
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
