const initialState = {
  initialVariation: [],
  childrenVariation: [],
  ancestorsToString: ""
};

export const posProductVariationReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_INITIAL_VARIATION":
      return { ...state, initialVariation: action.payload };
    case "SET_CHILDREN_VARIATION":
      return { ...state, childrenVariation: action.payload };
    case "SET_ANCESTORS_TO_STRING":
      return { ...state, ancestorsToString: action.payload };
    default:
      return state;
  }
};
