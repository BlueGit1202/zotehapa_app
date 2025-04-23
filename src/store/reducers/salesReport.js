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

export const salesReportReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_SALES_REPORT_LISTS":
      return {
        ...state,
        lists: action.payload.data,
        page: action.payload.meta,
        pagination: action.payload
      };
    case "SET_SALES_REPORT_SHOW":
      return {
        ...state,
        show: action.payload.data
      };
    case "RESET_SALES_REPORT_TEMP":
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
