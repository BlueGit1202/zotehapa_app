const initialState = {
  lists: [],
  page: {},
  pagination: [],
  temp: {
    temp_id: null,
    isEditing: false
  }
};

export default function productSectionProductReducer(
  state = initialState,
  action
) {
  switch (action.type) {
    case "PRODUCT_SECTION_PRODUCT_LIST":
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
    case "PRODUCT_SECTION_PRODUCT_RESET":
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
