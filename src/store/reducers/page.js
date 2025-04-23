const initialState = {
  lists: [],
  pagination: {},
  page: 1,
  show: {},
  temp: {
    temp_id: null,
    isEditing: false
  }
};

export const pageReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_PAGE_DATA":
      return {
        ...state,
        lists: action.payload.data,
        pagination: action.payload.meta
      };
    case "SET_PAGE":
      return {
        ...state,
        page: action.payload
      };
    case "SET_PAGE_SHOW":
      return {
        ...state,
        show: action.payload
      };
    case "SET_PAGE_TEMP":
      return {
        ...state,
        temp: {
          temp_id: action.payload,
          isEditing: true
        }
      };
    case "RESET_PAGE":
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
