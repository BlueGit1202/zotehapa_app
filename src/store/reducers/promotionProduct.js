const initialState = {
  lists: [],
  pagination: {},
  loading: {
    isActive: false
  }
};

export default function promotionProductReducer(state = initialState, action) {
  switch (action.type) {
    case "PROMOTION_PRODUCT_LIST":
      return {
        ...state,
        lists: action.payload.data,
        pagination: action.payload.meta,
        loading: {
          isActive: false
        }
      };
    case "PROMOTION_PRODUCT_LOADING":
      return {
        ...state,
        loading: {
          isActive: true
        }
      };
    case "PROMOTION_PRODUCT_RESET":
      return {
        ...state,
        loading: {
          isActive: false
        }
      };
    default:
      return state;
  }
}
