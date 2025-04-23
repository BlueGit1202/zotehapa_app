const initialState = {
  lists: [],
  show: null,
  temp: null,
  pagination: {
    current_page: 1,
    last_page: 1,
    total: 0
  },
  loading: false,
  errors: {}
};

export const sliderReducer = (state = initialState, action) => {
  switch (action.type) {
    case "slider/listsRequest":
      return {
        ...state,
        loading: true
      };
    case "slider/listsSuccess":
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
    case "slider/listsFailure":
      return {
        ...state,
        loading: false,
        errors: action.payload
      };
    case "slider/showRequest":
      return {
        ...state,
        loading: true
      };
    case "slider/showSuccess":
      return {
        ...state,
        loading: false,
        show: action.payload
      };
    case "slider/showFailure":
      return {
        ...state,
        loading: false,
        errors: action.payload
      };
    case "slider/saveRequest":
      return {
        ...state,
        loading: true
      };
    case "slider/saveSuccess":
      return {
        ...state,
        loading: false,
        temp: action.payload
      };
    case "slider/saveFailure":
      return {
        ...state,
        loading: false,
        errors: action.payload
      };
    case "slider/edit":
      return {
        ...state,
        temp: {
          temp_id: action.payload.id
        }
      };
    case "slider/destroyRequest":
      return {
        ...state,
        loading: true
      };
    case "slider/destroySuccess":
      return {
        ...state,
        loading: false
      };
    case "slider/destroyFailure":
      return {
        ...state,
        loading: false,
        errors: action.payload
      };
    case "slider/reset":
      return {
        ...state,
        temp: null,
        errors: {}
      };
    default:
      return state;
  }
};
