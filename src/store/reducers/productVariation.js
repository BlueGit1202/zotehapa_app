const initialState = {
  tree: [],
  singleTree: [],
  treeWithSelected: [],
  lists: [],
  page: {},
  pagination: [],
  show: {},
  temp: {
    temp_date: [],
    temp_id: null,
    isEditing: false
  },
  initialVariation: [],
  childrenVariation: [],
  ancestorsToString: "",
  ancestorsAndSelfId: [],
  loading: false,
  error: null
};

export const productVariationReducer = (state = initialState, action) => {
  switch (action.type) {
    case "PRODUCT_VARIATION_TREE_REQUEST":
      return { ...state, loading: true };
    case "PRODUCT_VARIATION_TREE_SUCCESS":
      return { ...state, loading: false, tree: action.payload };
    case "PRODUCT_VARIATION_TREE_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "PRODUCT_VARIATION_SINGLE_TREE_REQUEST":
      return { ...state, loading: true };
    case "PRODUCT_VARIATION_SINGLE_TREE_SUCCESS":
      return { ...state, loading: false, singleTree: action.payload };
    case "PRODUCT_VARIATION_SINGLE_TREE_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "PRODUCT_VARIATION_TREE_WITH_SELECTED_REQUEST":
      return { ...state, loading: true };
    case "PRODUCT_VARIATION_TREE_WITH_SELECTED_SUCCESS":
      return { ...state, loading: false, treeWithSelected: action.payload };
    case "PRODUCT_VARIATION_TREE_WITH_SELECTED_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "PRODUCT_VARIATION_LIST_REQUEST":
      return { ...state, loading: true };
    case "PRODUCT_VARIATION_LIST_SUCCESS":
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
    case "PRODUCT_VARIATION_LIST_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "PRODUCT_VARIATION_SAVE_REQUEST":
      return { ...state, loading: true };
    case "PRODUCT_VARIATION_SAVE_SUCCESS":
      return { ...state, loading: false };
    case "PRODUCT_VARIATION_SAVE_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "PRODUCT_VARIATION_EDIT_REQUEST":
      return { ...state, loading: true };
    case "PRODUCT_VARIATION_EDIT_SUCCESS":
      return {
        ...state,
        loading: false,
        temp: {
          temp_date: action.payload.data,
          temp_id: action.payload.id,
          isEditing: true
        }
      };
    case "PRODUCT_VARIATION_EDIT_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "PRODUCT_VARIATION_DELETE_REQUEST":
      return { ...state, loading: true };
    case "PRODUCT_VARIATION_DELETE_SUCCESS":
      return { ...state, loading: false };
    case "PRODUCT_VARIATION_DELETE_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "PRODUCT_VARIATION_SHOW_REQUEST":
      return { ...state, loading: true };
    case "PRODUCT_VARIATION_SHOW_SUCCESS":
      return { ...state, loading: false, show: action.payload };
    case "PRODUCT_VARIATION_SHOW_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "PRODUCT_VARIATION_INITIAL_REQUEST":
      return { ...state, loading: true };
    case "PRODUCT_VARIATION_INITIAL_SUCCESS":
      return { ...state, loading: false, initialVariation: action.payload };
    case "PRODUCT_VARIATION_INITIAL_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "PRODUCT_VARIATION_CHILDREN_REQUEST":
      return { ...state, loading: true };
    case "PRODUCT_VARIATION_CHILDREN_SUCCESS":
      return { ...state, loading: false, childrenVariation: action.payload };
    case "PRODUCT_VARIATION_CHILDREN_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "PRODUCT_VARIATION_ANCESTORS_REQUEST":
      return { ...state, loading: true };
    case "PRODUCT_VARIATION_ANCESTORS_SUCCESS":
      return { ...state, loading: false, ancestorsToString: action.payload };
    case "PRODUCT_VARIATION_ANCESTORS_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "PRODUCT_VARIATION_ANCESTORS_ID_REQUEST":
      return { ...state, loading: true };
    case "PRODUCT_VARIATION_ANCESTORS_ID_SUCCESS":
      return { ...state, loading: false, ancestorsAndSelfId: action.payload };
    case "PRODUCT_VARIATION_ANCESTORS_ID_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "PRODUCT_VARIATION_RESET":
      return initialState;

    default:
      return state;
  }
};
