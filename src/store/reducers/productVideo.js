const initialState = {
  lists: [],
  page: {},
  pagination: [],
  show: {},
  temp: {
    temp_id: null,
    isEditing: false
  },
  loading: false,
  error: null
};

export const productVideoReducer = (state = initialState, action) => {
  switch (action.type) {
    case "PRODUCT_VIDEO_LIST_REQUEST":
      return { ...state, loading: true };
    case "PRODUCT_VIDEO_LIST_SUCCESS":
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
    case "PRODUCT_VIDEO_LIST_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "PRODUCT_VIDEO_SAVE_REQUEST":
      return { ...state, loading: true };
    case "PRODUCT_VIDEO_SAVE_SUCCESS":
      return { ...state, loading: false };
    case "PRODUCT_VIDEO_SAVE_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "PRODUCT_VIDEO_EDIT_REQUEST":
      return { ...state, loading: true };
    case "PRODUCT_VIDEO_EDIT_SUCCESS":
      return {
        ...state,
        loading: false,
        temp: {
          temp_id: action.payload,
          isEditing: true
        }
      };
    case "PRODUCT_VIDEO_EDIT_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "PRODUCT_VIDEO_DELETE_REQUEST":
      return { ...state, loading: true };
    case "PRODUCT_VIDEO_DELETE_SUCCESS":
      return { ...state, loading: false };
    case "PRODUCT_VIDEO_DELETE_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "PRODUCT_VIDEO_RESET":
      return initialState;

    default:
      return state;
  }
};
