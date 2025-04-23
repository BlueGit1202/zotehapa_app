const initialState = {
  totalSales: null,
  totalOrders: null,
  totalCustomers: null,
  totalProducts: null,
  orderStatistics: {},
  orderSummary: {},
  salesSummary: {},
  customerStates: {},
  topProducts: [],
  topCustomers: []
};

export const dashboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_TOTAL_SALES":
      return { ...state, totalSales: action.payload };
    case "SET_TOTAL_ORDERS":
      return { ...state, totalOrders: action.payload };
    case "SET_TOTAL_CUSTOMERS":
      return { ...state, totalCustomers: action.payload };
    case "SET_TOTAL_PRODUCTS":
      return { ...state, totalProducts: action.payload };
    case "SET_ORDER_STATISTICS":
      return { ...state, orderStatistics: action.payload };
    case "SET_ORDER_SUMMARY":
      return { ...state, orderSummary: action.payload };
    case "SET_SALES_SUMMARY":
      return { ...state, salesSummary: action.payload };
    case "SET_CUSTOMER_STATES":
      return { ...state, customerStates: action.payload };
    case "SET_TOP_PRODUCTS":
      return { ...state, topProducts: action.payload };
    case "SET_TOP_CUSTOMERS":
      return { ...state, topCustomers: action.payload };
    default:
      return state;
  }
};
