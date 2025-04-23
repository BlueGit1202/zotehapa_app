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

export const analyticReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ANALYTIC_LISTS":
      return {
        ...state,
        lists: action.payload.data,
        page: action.payload.meta,
        pagination: action.payload
      };
    case "ANALYTIC_SHOW":
      return {
        ...state,
        show: action.payload.data
      };
    case "ANALYTIC_TEMP":
      return {
        ...state,
        temp: {
          temp_id: action.payload,
          isEditing: true
        }
      };
    case "ANALYTIC_RESET":
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
