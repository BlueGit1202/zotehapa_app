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

export const productAttributeReducer = (state = initialState, action) => {
  switch (action.type) {
    case "PRODUCT_ATTRIBUTE_LISTS":
      return {
        ...state,
        lists: action.payload.data,
        page: action.payload.meta,
        pagination: action.payload
      };
    case "PRODUCT_ATTRIBUTE_SHOW":
      return {
        ...state,
        show: action.payload
      };
    case "PRODUCT_ATTRIBUTE_TEMP":
      return {
        ...state,
        temp: {
          temp_id: action.payload,
          isEditing: true
        }
      };
    case "PRODUCT_ATTRIBUTE_RESET":
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
