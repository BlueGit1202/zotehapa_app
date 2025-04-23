// Reducer
const initialState = {
  lists: []
};

export const timezoneReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_TIMEZONES":
      return { ...state, lists: action.payload };
    default:
      return state;
  }
};
