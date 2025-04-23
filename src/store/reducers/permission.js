const initialState = {
  lists: []
};

export const permissionReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_PERMISSION_LISTS":
      return { ...state, lists: action.payload };
    default:
      return state;
  }
};
