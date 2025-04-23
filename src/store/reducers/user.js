// Reducer
const initialState = {
  lists: [],
  page: {},
  pagination: []
};

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_USERS":
      return { ...state, lists: action.payload };
    case "SET_USER_PAGE":
      return { ...state, page: action.payload };
    case "SET_USER_PAGINATION":
      return { ...state, pagination: action.payload };
    default:
      return state;
  }
};
