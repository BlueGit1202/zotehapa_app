const initialState = {
  lists: [],
  show: null,
  products: [],
  productPage: {},
  productPagination: [],
  loading: false,
  error: null
};

export default function productSectionReducer(state = initialState, action) {
  switch (action.type) {
    case "SECTION_REQUEST":
      return { ...state, loading: true, error: null };
    case "FETCH_SECTIONS_SUCCESS":
      return { ...state, loading: false, lists: action.payload };
    case "FETCH_SECTION_SUCCESS":
      return { ...state, loading: false, show: action.payload };
    case "FETCH_SECTION_PRODUCTS_SUCCESS":
      return {
        ...state,
        loading: false,
        products: action.payload.products,
        productPage: action.payload.page,
        productPagination: action.payload.pagination
      };
    case "SECTION_FAILURE":
      return { ...state, loading: false, error: action.payload };

    case 'RESET_SECTION_PRODUCTS':
      return initialState;
    
      default:
      return state;
  }
}
