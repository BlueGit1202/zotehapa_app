const initialState = {
  ancestorsAndSelf: [],
  trees: [],
  lists: []
};

export const posProductCategoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_ANCESTORS_AND_SELF":
      return { ...state, ancestorsAndSelf: action.payload };
    case "SET_CATEGORY_TREES":
      return { ...state, trees: action.payload };
    case "SET_CATEGORY_LISTS":
      return { ...state, lists: action.payload };
    default:
      return state;
  }
};
