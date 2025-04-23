const initialState = {
  lists: [],
  loading: false,
  error: null,
    wishlistProducts: [],
  wishlistProductPage: {},
  wishlistProductPagination: {},
};

const frontendWishlistReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_WISHLIST_REQUEST':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'FETCH_WISHLIST_SUCCESS':
      return {
        ...state,
        loading: false,
        lists: action.payload,
        error: null
      };
    case 'FETCH_WISHLIST_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
case 'SET_WISHLIST':
      return {
        ...state,
        lists: action.payload,
      };
    case 'SET_WISHLIST_PRODUCTS':
      return {
        ...state,
        wishlistProducts: action.payload.data,
        wishlistProductPage: {
          from: action.payload.meta?.from,
          to: action.payload.meta?.to,
          total: action.payload.meta?.total,
        },
        wishlistProductPagination: action.payload,
      };
    case 'TOGGLE_WISHLIST':
      // Handle wishlist toggle logic
      return state;
    case 'RESET_WISHLIST':
      return initialState;
  
    default:
      return state;
  }
};

export default frontendWishlistReducer;