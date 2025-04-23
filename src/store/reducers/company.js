const initialState = {
  lists: {}
};

export const companyReducer = (state = initialState, action) => {
  switch (action.type) {
    case "COMPANY_LISTS":
      return {
        ...state,
        lists: action.payload
      };
    default:
      return state;
  }
};
