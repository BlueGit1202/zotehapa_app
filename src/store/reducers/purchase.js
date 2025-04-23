const initialState = {
  lists: [],
  page: {},
  show: {},
  viewPayment: {},
  edit: {},
  pagination: [],
  temp: {
    temp_id: null,
    isEditing: false,
  },
};

export default function purchaseReducer(state = initialState, action) {
  switch (action.type) {
    case "SET_PURCHASE_LISTS":
      return {
        ...state,
        lists: action.payload,
      };
    case "SET_PURCHASE_PAGINATION":
      return {
        ...state,
        pagination: action.payload,
      };
    case "SET_PURCHASE_PAGE":
      if (action.payload) {
        return {
          ...state,
          page: {
            from: action.payload.from,
            to: action.payload.to,
            total: action.payload.total,
          },
        };
      }
      return state;
    case "SET_PURCHASE_SHOW":
      return {
        ...state,
        show: action.payload,
      };
    case "SET_PURCHASE_VIEW_PAYMENT":
      return {
        ...state,
        viewPayment: action.payload,
      };
    case "SET_PURCHASE_EDIT":
      return {
        ...state,
        edit: action.payload,
      };
    case "SET_PURCHASE_TEMP":
      return {
        ...state,
        temp: {
          ...state.temp,
          temp_id: action.payload,
          isEditing: true,
        },
      };
    case "RESET_PURCHASE":
      return {
        ...state,
        temp: {
          temp_id: null,
          isEditing: false,
        },
      };
    default:
      return state;
  }
}
