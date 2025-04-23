const initialState = {
  lists: [],
  loading: false,
  error: null
};

export const productSeoReducer = (state = initialState, action) => {
  switch (action.type) {
    case "PRODUCT_SEO_LIST_REQUEST":
      return { ...state, loading: true };
    case "PRODUCT_SEO_LIST_SUCCESS":
      return { ...state, loading: false, lists: action.payload };
    case "PRODUCT_SEO_LIST_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "PRODUCT_SEO_SAVE_REQUEST":
      return { ...state, loading: true };
    case "PRODUCT_SEO_SAVE_SUCCESS":
      return { ...state, loading: false };
    case "PRODUCT_SEO_SAVE_FAIL":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};
