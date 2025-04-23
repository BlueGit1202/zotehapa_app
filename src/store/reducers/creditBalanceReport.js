const initialState = {
  lists: [],
  page: {},
  pagination: []
};

export const creditBalanceReportReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_CREDIT_BALANCE_REPORT_LISTS":
      return {
        ...state,
        lists: action.payload
      };
    case "SET_CREDIT_BALANCE_REPORT_PAGINATION":
      return {
        ...state,
        pagination: action.payload
      };
    case "SET_CREDIT_BALANCE_REPORT_PAGE":
      return {
        ...state,
        page: {
          from: action.payload.from,
          to: action.payload.to,
          total: action.payload.total
        }
      };
    default:
      return state;
  }
};
