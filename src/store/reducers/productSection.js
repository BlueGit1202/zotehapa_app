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

export default function productSectionReducer(state = initialState, action) {
  switch (action.type) {
    case "PRODUCT_SECTION_LIST":
      return {
        ...state,
        lists: action.payload.data,
        pagination: action.payload,
        page: {
          from: action.payload.meta.from,
          to: action.payload.meta.to,
          total: action.payload.meta.total
        }
      };
    case "PRODUCT_SECTION_SHOW":
      return {
        ...state,
        show: action.payload.data
      };
    case "PRODUCT_SECTION_RESET":
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
}
