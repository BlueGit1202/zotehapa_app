const initialState = {
  lists: [],
  page: {},
  pagination: [],
  show: {},
  temp: {
    temp_id: null,
    isEditing: false
  }
};

export const couponReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_COUPON_LISTS":
      return {
        ...state,
        lists: action.payload
      };
    case "SET_COUPON_PAGINATION":
      return {
        ...state,
        pagination: action.payload
      };
    case "SET_COUPON_PAGE":
      return {
        ...state,
        page: {
          from: action.payload.from,
          to: action.payload.to,
          total: action.payload.total
        }
      };
    case "SET_COUPON_SHOW":
      return {
        ...state,
        show: action.payload
      };
    case "SET_COUPON_TEMP":
      return {
        ...state,
        temp: {
          temp_id: action.payload,
          isEditing: true
        }
      };
    case "RESET_COUPON":
      return {
        ...state,
        temp: {
          temp_id: null,
          isEditing: false
        }
      };
    default:
      return state;
  }
};
