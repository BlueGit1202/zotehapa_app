const initialState = {
  lists: []
};

export const frontendSliderReducer = (state = initialState, action) => {
  switch (action.type) {
    case "slider/lists":
      return { ...state, lists: action.payload };
    default:
      return state;
  }
};
