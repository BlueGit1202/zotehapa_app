const initialState = {
  lists: {}
};

export const licenseReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LICENSE_LISTS":
      return {
        ...state,
        lists: action.payload
      };
    default:
      return state;
  }
};
