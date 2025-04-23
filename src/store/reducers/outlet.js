const initialState = {
  lists: [],
  pagination: {},
  page: 1,
  show: {},
  temp: {
    temp_id: null
  }
};

export const outletReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_OUTLET_DATA":
      return {
        ...state,
        lists: action.payload.data,
        pagination: action.payload.meta
      };
    case "SET_OUTLET_PAGE":
      return {
        ...state,
        page: action.payload
      };
    case "SET_OUTLET_SHOW":
      return {
        ...state,
        show: action.payload
      };
    case "SET_OUTLET_TEMP":
      return {
        ...state,
        temp: {
          temp_id: action.payload
        }
      };
    case "RESET_OUTLET":
      return {
        ...state,
        temp: {
          temp_id: null
        }
      };
    default:
      return state;
  }
};
