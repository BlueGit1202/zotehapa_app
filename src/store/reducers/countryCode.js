const initialState = {
  lists: [],
  show: null
};

export const countryCodeReducer = (state = initialState, action) => {
  switch (action.type) {
    case "COUNTRY_CODE/SET_LISTS":
      return { ...state, lists: action.payload };
    case "COUNTRY_CODE/SET_DETAILS":
      return { ...state, show: action.payload };
    default:
      return state;
  }
};
