const initialState = {
  lists: {},
  loading: false,
  errors: {}
};

export const themeReducer = (state = initialState, action) => {
  switch (action.type) {
    case "theme/listsRequest":
      return {
        ...state,
        loading: true
      };
    case "theme/listsSuccess":
      return {
        ...state,
        loading: false,
        lists: action.payload
      };
    case "theme/listsFailure":
      return {
        ...state,
        loading: false,
        errors: action.payload
      };
    case "theme/saveRequest":
      return {
        ...state,
        loading: true
      };
    case "theme/saveSuccess":
      return {
        ...state,
        loading: false,
        lists: action.payload
      };
    case "theme/saveFailure":
      return {
        ...state,
        loading: false,
        errors: action.payload
      };
    default:
      return state;
  }
};
