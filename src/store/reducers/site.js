const initialState = {
  lists: {},
  loading: false,
  errors: {}
};

export const siteReducer = (state = initialState, action) => {
  switch (action.type) {
    case "site/listsRequest":
      return {
        ...state,
        loading: true
      };
    case "site/listsSuccess":
      return {
        ...state,
        loading: false,
        lists: action.payload
      };
    case "site/listsFailure":
      return {
        ...state,
        loading: false,
        errors: action.payload
      };
    case "site/saveRequest":
      return {
        ...state,
        loading: true
      };
    case "site/saveSuccess":
      return {
        ...state,
        loading: false,
        lists: action.payload
      };
    case "site/saveFailure":
      return {
        ...state,
        loading: false,
        errors: action.payload
      };
    default:
      return state;
  }
};
