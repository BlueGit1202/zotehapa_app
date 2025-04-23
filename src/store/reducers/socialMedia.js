const initialState = {
  lists: {},
  loading: false,
  errors: {}
};

export const socialMediaReducer = (state = initialState, action) => {
  switch (action.type) {
    case "socialMedia/listsRequest":
      return {
        ...state,
        loading: true
      };
    case "socialMedia/listsSuccess":
      return {
        ...state,
        loading: false,
        lists: action.payload
      };
    case "socialMedia/listsFailure":
      return {
        ...state,
        loading: false,
        errors: action.payload
      };
    case "socialMedia/saveRequest":
      return {
        ...state,
        loading: true
      };
    case "socialMedia/saveSuccess":
      return {
        ...state,
        loading: false,
        lists: action.payload
      };
    case "socialMedia/saveFailure":
      return {
        ...state,
        loading: false,
        errors: action.payload
      };
    default:
      return state;
  }
};
