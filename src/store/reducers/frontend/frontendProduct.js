const initialState = {
  show: null,
  showImages: [],
  showReviews: [],
  showVideos: [],
  showSeo: null,
  popularProducts: [],
  popularProductPage: {},
  popularProductPagination: [],
  flashSaleProducts: [],
  flashSaleProductPage: {},
  flashSaleProductPagination: [],
  categoryWiseProducts: [],
  categoryWiseBands: [],
  categoryWiseVariations: [],
  categoryWiseProductPage: {},
  categoryWiseProductPagination: {},
  offerProducts: [],
  offerProductPage: {},
  offerProductPagination: [],
  relatedProducts: [],
  relatedProductPage: {},
  relatedProductPagination: [],
  wishlistProducts: [],
  wishlistProductPage: {},
  wishlistProductPagination: [],
  loading: false,
  error: null
};

export default function productReducer(state = initialState, action) {
  switch (action.type) {
    case "PRODUCT_REQUEST":
      return { ...state, loading: true, error: null };
    case "FETCH_PRODUCT_SUCCESS":
      return {
        ...state,
        loading: false,
        show: action.payload.product,
        showImages: action.payload.images,
        showReviews: action.payload.reviews,
        showVideos: action.payload.videos,
        showSeo: action.payload.seo
      };
    case "FETCH_POPULAR_PRODUCTS_SUCCESS":
      return {
        ...state,
        loading: false,
        popularProducts: action.payload.products,
        popularProductPage: action.payload.page,
        popularProductPagination: action.payload.pagination
      };
    // Add similar cases for other product types
    case "PRODUCT_FAILURE":
      return { ...state, loading: false, error: action.payload };

      case 'FETCH_FLASH_SALE_PRODUCTS_REQUEST':
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case 'FETCH_FLASH_SALE_PRODUCTS_SUCCESS':
      return {
        ...state,
        loading: false,
        flashSaleProducts: action.payload,
        error: null
      };
    
    case 'FETCH_FLASH_SALE_PRODUCTS_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload
      };

      case 'FETCH_OFFER_PRODUCTS_REQUEST':
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case 'FETCH_OFFER_PRODUCTS_SUCCESS':
      return {
        ...state,
        loading: false,
        offerProducts: action.payload.data,
        offerProductPagination: {
          data: action.payload.data,
          meta: action.payload.meta,
          links: action.payload.links
        },
        error: null
      };
    
    case 'FETCH_OFFER_PRODUCTS_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload
      };

       case 'FETCH_CATEGORY_WISE_PRODUCTS_REQUEST':
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case 'FETCH_CATEGORY_WISE_PRODUCTS_SUCCESS':
      return {
        ...state,
        loading: false,
        categoryWiseProducts: action.payload.products,
        categoryWiseBands: action.payload.brands,
        categoryWiseVariations: action.payload.variations,
        categoryWiseProductPagination: {
          data: action.payload.products,
          meta: action.payload.meta,
          links: action.payload.links
        },
        error: null
      };
    
    case 'FETCH_CATEGORY_WISE_PRODUCTS_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload
      };

       case 'SET_PRODUCT_DETAILS':
      return {
        ...state,
        show: action.payload.data,
        showImages: action.payload.data.images || [],
        showReviews: action.payload.data.reviews || [],
        showVideos: action.payload.data.videos || [],
        showSeo: action.payload.data.seo || {},
      };
    case 'SET_RELATED_PRODUCTS':
      return {
        ...state,
        relatedProducts: action.payload.data || [],
        relatedProductPage: {
          from: action.payload.meta?.from,
          to: action.payload.meta?.to,
          total: action.payload.meta?.total,
        },
        relatedProductPagination: action.payload,
      };
    case 'UPDATE_PRODUCT_REVIEWS':
      return {
        ...state,
        showReviews: action.payload,
      };
    case 'RESET_PRODUCT_DETAILS':
      return initialState;

    default:
      return state;
  }
}
