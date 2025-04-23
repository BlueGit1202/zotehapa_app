const initialState = {
  lists: [],
  show: {},
  products: [],
  productPage: {},
  productPagination: [],
  loading: false,
  error: null,
};

export default function promotionReducer(state = initialState, action) {
  switch (action.type) {
    case "PROMOTION_REQUEST":
      return { ...state, loading: true, error: null };
    case "FETCH_PROMOTIONS_SUCCESS":
      return { ...state, loading: false, lists: action.payload };
    case "FETCH_PROMOTION_SUCCESS":
      return { ...state, loading: false, show: action.payload };
    case "FETCH_PROMOTION_PRODUCTS_SUCCESS":
      return {
        ...state,
        loading: false,
        products: action.payload.products,
        productPage: action.payload.page,
        productPagination: action.payload.pagination,
      };
    case "PROMOTION_FAILURE":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}
