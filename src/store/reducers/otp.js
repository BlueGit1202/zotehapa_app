const initialState = {
  lists: {}
};

export const otpReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_OTP_DATA":
      return {
        ...state,
        lists: action.payload
      };
    default:
      return state;
  }
};
