const initialState = {
  lists: {}
};

export const mailReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_MAIL_DATA":
      return {
        ...state,
        lists: action.payload
      };
    default:
      return state;
  }
};
