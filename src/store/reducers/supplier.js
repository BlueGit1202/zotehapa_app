const initialState = {
  lists: [],
  show: null,
  temp: {
    temp_id: null,
    isEditing: false
  },
  pagination: {
    current_page: 1,
    last_page: 1,
    total: 0
  },
  loading: false,
  errors: {}
};

const supplierReducer = (state = initialState, action) => {
  switch (action.type) {
    case "supplier/listsRequest":
      return {
        ...state,
        loading: true
      };
    case "supplier/listsSuccess":
      return {
        ...state,
        loading: false,
        lists: action.payload.data,
        pagination: {
          current_page: action.payload.meta.current_page,
          last_page: action.payload.meta.last_page,
          total: action.payload.meta.total
        }
      };
    case "supplier/listsFailure":
      return {
        ...state,
        loading: false,
        errors: action.payload
      };
    case "supplier/saveRequest":
      return {
        ...state,
        loading: true
      };
    case "supplier/saveSuccess":
      return {
        ...state,
        loading: false,
        temp: {
          temp_id: action.payload.id,
          isEditing: true
        }
      };
    case "supplier/saveFailure":
      return {
        ...state,
        loading: false,
        errors: action.payload
      };
    case "supplier/showRequest":
      return {
        ...state,
        loading: true
      };
    case "supplier/showSuccess":
      return {
        ...state,
        loading: false,
        show: action.payload
      };
    case "supplier/showFailure":
      return {
        ...state,
        loading: false,
        errors: action.payload
      };
    case "supplier/edit":
      return {
        ...state,
        temp: {
          temp_id: action.payload,
          isEditing: true
        }
      };
    case "supplier/destroyRequest":
      return {
        ...state,
        loading: true
      };
    case "supplier/destroySuccess":
      return {
        ...state,
        loading: false
      };
    case "supplier/destroyFailure":
      return {
        ...state,
        loading: false,
        errors: action.payload
      };
    case "supplier/reset":
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

export default supplierReducer;
