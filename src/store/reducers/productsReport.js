const initialState = {
  lists: [],
  page: {},
  pagination: [],
  loading: {
    isActive: false
  }
};

export default function productsReportReducer(state = initialState, action) {
  switch (action.type) {
    case "PRODUCTS_REPORT_LIST":
      return {
        ...state,
        lists: action.payload.data,
        pagination: action.payload.pagination,
        page: {
          from: action.payload.meta.from,
          to: action.payload.meta.to,
          total: action.payload.meta.total
        },
        loading: {
          isActive: false
        }
      };
    case "PRODUCTS_REPORT_LOADING":
      return {
        ...state,
        loading: {
          isActive: true
        }
      };
    default:
      return state;
  }
}
