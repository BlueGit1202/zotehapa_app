const initialState = {
  lists: [],
  subtotal: 0,
  total: 0,
  discount: 0,
  totalTax: 0
};

export const posCartReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_TO_CART":
      return { ...state, lists: [...state.lists, action.payload] };
    // ... (other cart reducer cases from previous implementation)
    default:
      return state;
  }
};
