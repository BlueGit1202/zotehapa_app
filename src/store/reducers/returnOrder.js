const initialState = {
  lists: [],
  page: {},
  pagination: [],
  show: {},
  edit: {},
  temp: {
    temp_id: null,
    isEditing: false
  }
};

export const returnOrderReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_RETURN_ORDER_LISTS":
      return {
        ...state,
        lists: action.payload.data,
        page: action.payload.meta,
        pagination: action.payload
      };
    case "SET_RETURN_ORDER_SHOW":
      return {
        ...state,
        show: action.payload.data
      };
    case "SET_RETURN_ORDER_EDIT":
      return {
        ...state,
        edit: action.payload.data,
        temp: {
          temp_id: action.payload.id,
          isEditing: true
        }
      };
    case "RESET_RETURN_ORDER_TEMP":
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
