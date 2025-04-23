const initialState = {
  lists: []
};

export const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case "NOTIFICATION/SET_LISTS":
      return { ...state, lists: action.payload };
    default:
      return state;
  }
};
