const initialState = {
  lists: [],
  page: {},
  pagination: [],
  show: {},
  sku: "",
  temp: {
    temp_id: null,
    isEditing: false
  },
  purchasableList: [],
  simpleList: [],
  loading: false,
  error: null
};

export const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case "PRODUCT_LIST_REQUEST":
      return { ...state, loading: true, lists: [] };
    case "PRODUCT_LIST_SUCCESS":
      return {
        ...state,
        loading: false,
        lists: action.payload.data,
        page: {
          from: action.payload.meta.from,
          to: action.payload.meta.to,
          total: action.payload.meta.total
        },
        pagination: action.payload
      };
    case "PRODUCT_LIST_FAIL":
      return { ...state, loading: false, error: action.payload };
    
    case "SET_PRODUCT_TEMP":
      return {
        ...state,
        temp: {
          temp_id: action.payload,
          isEditing: true
        }
      };

    case "PRODUCT_SHOW_REQUEST":
      return { ...state, loading: true };
    case "PRODUCT_SHOW_SUCCESS":
      return { ...state, loading: false, show: action.payload };
    case "PRODUCT_SHOW_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "PRODUCT_SAVE_REQUEST":
      return { ...state, loading: true };
    case "PRODUCT_SAVE_SUCCESS":
      return {
        ...state,
        loading: false,
        temp: {
          temp_id: action.payload.id,
          isEditing: true
        }
      };
    case "PRODUCT_SAVE_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "PRODUCT_DELETE_REQUEST":
      return { ...state, loading: true };
    case "PRODUCT_DELETE_SUCCESS":
      return { ...state, loading: false };
    case "PRODUCT_DELETE_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "PRODUCT_UPLOAD_IMAGE_REQUEST":
      return { ...state, loading: true };
    case "PRODUCT_UPLOAD_IMAGE_SUCCESS":
      return { ...state, loading: false, show: action.payload };
    case "PRODUCT_UPLOAD_IMAGE_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "PRODUCT_DELETE_IMAGE_REQUEST":
      return { ...state, loading: true };
    case "PRODUCT_DELETE_IMAGE_SUCCESS":
      return { ...state, loading: false, show: action.payload };
    case "PRODUCT_DELETE_IMAGE_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "PRODUCT_SHIPPING_RETURN_REQUEST":
      return { ...state, loading: true };
    case "PRODUCT_SHIPPING_RETURN_SUCCESS":
      return { ...state, loading: false, show: action.payload };
    case "PRODUCT_SHIPPING_RETURN_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "PRODUCT_OFFER_REQUEST":
      return { ...state, loading: true };
    case "PRODUCT_OFFER_SUCCESS":
      return { ...state, loading: false, show: action.payload };
    case "PRODUCT_OFFER_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "PRODUCT_SKU_REQUEST":
      return { ...state, loading: true };
    case "PRODUCT_SKU_SUCCESS":
      return { ...state, loading: false, sku: String(action.payload.product_sku) };
    case "PRODUCT_SKU_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "PRODUCT_EXPORT_REQUEST":
      return { ...state, loading: true };
    case "PRODUCT_EXPORT_SUCCESS":
      return { ...state, loading: false };
    case "PRODUCT_EXPORT_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "PRODUCT_PURCHASABLE_REQUEST":
      return { ...state, loading: true };
    case "PRODUCT_PURCHASABLE_SUCCESS":
      return { ...state, loading: false, purchasableList: action.payload };
    case "PRODUCT_PURCHASABLE_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "PRODUCT_SIMPLE_REQUEST":
      return { ...state, loading: true };
    case "PRODUCT_SIMPLE_SUCCESS":
      return { ...state, loading: false, simpleList: action.payload };
    case "PRODUCT_SIMPLE_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "PRODUCT_RESET":
      return initialState;

    default:
      return state;
  }
};
