const initialState = {
  lists: {}
};

export const cookiesReducer = (state = initialState, action) => {
  switch (action.type) {
    case "COOKIES_LISTS":
      return {
        ...state,
        lists: action.payload
      };
    default:
      return state;
  }
};
