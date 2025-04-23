const initialState = {
  lists: [],
  page: {},
  pagination: [],
  temp: {
    temp_id: null,
    isEditing: false
  }
};

export const productAttributeOptionReducer = (state = initialState, action) => {
  switch (action.type) {
    case "PRODUCT_ATTRIBUTE_OPTION_LISTS":
      return {
        ...state,
        lists: action.payload.data,
        page: action.payload.meta,
        pagination: action.payload
      };
    case "PRODUCT_ATTRIBUTE_OPTION_TEMP":
      return {
        ...state,
        temp: {
          temp_id: action.payload,
          isEditing: true
        }
      };
    case "PRODUCT_ATTRIBUTE_OPTION_RESET":
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
