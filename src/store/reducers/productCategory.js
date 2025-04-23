const initialState = {
  depthTrees: [],
  lists: [],
  page: {},
  pagination: [],
  show: {},
  temp: {
    temp_id: null,
    isEditing: false
  }
};

export const productCategoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case "PRODUCT_CATEGORY_DEPTH_TREES":
      return {
        ...state,
        depthTrees: action.payload
      };
    case "PRODUCT_CATEGORY_LISTS":
      return {
        ...state,
        lists: action.payload.data,
        page: action.payload.meta,
        pagination: action.payload
      };
    case "PRODUCT_CATEGORY_SHOW":
      return {
        ...state,
        show: action.payload
      };
    case "PRODUCT_CATEGORY_TEMP":
      return {
        ...state,
        temp: {
          temp_id: action.payload,
          isEditing: true
        }
      };
    case "PRODUCT_CATEGORY_RESET":
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
