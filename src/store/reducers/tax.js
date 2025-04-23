const initialState = {
  lists: [],
  show: null,
  temp: {
    temp_id: null,
    isEditing: false
  },
 page: {},
  pagination: [],
  loading: false,
  errors: {}
};

export const taxReducer = (state = initialState, action) => {
  switch (action.type) {
    case "TAX_LIST_REQUEST":
      return {
        ...state,
        loading: true
      };
    case "TAX_LIST_SUCCESS":
      return {
        ...state,
        loading: false,
        lists: action.payload.data,
        page: action.payload.meta,
        pagination: action.payload
      };
    case "TAX_LIST_FAILURE":
      return {
        ...state,
        loading: false,
        errors: action.payload
      };
    case "TAX_SAVE_REQUEST":
      return {
        ...state,
        loading: true
      };
    case "TAX_SAVE_SUCCESS":
      return {
        ...state,
        loading: false,
        temp: {
          temp_id: action.payload.id,
          isEditing: true
        }
      };
    case "TAX_SAVE_FAILURE":
      return {
        ...state,
        loading: false,
        errors: action.payload
      };
    case "tax/showRequest":
      return {
        ...state,
        loading: true
      };
    case "tax/showSuccess":
      return {
        ...state,
        loading: false,
        show: action.payload
      };
    case "tax/showFailure":
      return {
        ...state,
        loading: false,
        errors: action.payload
      };
    case "tax/edit":
      return {
        ...state,
        temp: {
          temp_id: action.payload,
          isEditing: true
        }
      };
    case "tax/destroyRequest":
      return {
        ...state,
        loading: true
      };
    case "tax/destroySuccess":
      return {
        ...state,
        loading: false
      };
    case "tax/destroyFailure":
      return {
        ...state,
        loading: false,
        errors: action.payload
      };
    case "tax/reset":
      return {
        ...state,
        temp: {
          temp_id: null,
          isEditing: false
        },
        errors: {}
      };
    default:
      return state;
  }
};
