export const dashboardActions = {
  fetchTotalSales: () => async dispatch => {
    try {
      const res = await axios.get("admin/dashboard/total-sales");
      dispatch({ type: "SET_TOTAL_SALES", payload: res.data.data });
      return res;
    } catch (err) {
      throw err;
    }
  },
  fetchTotalOrders: () => async dispatch => {
    try {
      const res = await axios.get("admin/dashboard/total-orders");
      dispatch({ type: "SET_TOTAL_ORDERS", payload: res.data.data });
      return res;
    } catch (err) {
      throw err;
    }
  },
  fetchTotalCustomers: () => async dispatch => {
    try {
      const res = await axios.get("admin/dashboard/total-customers");
      dispatch({ type: "SET_TOTAL_CUSTOMERS", payload: res.data.data });
      return res;
    } catch (err) {
      throw err;
    }
  },
  fetchTotalProducts: () => async dispatch => {
    try {
      const res = await axios.get("admin/dashboard/total-products");
      dispatch({ type: "SET_TOTAL_PRODUCTS", payload: res.data.data });
      return res;
    } catch (err) {
      throw err;
    }
  },
  fetchOrderStatistics: payload => async dispatch => {
    try {
      let url = "admin/dashboard/order-statistics";
      if (payload) {
        url += appService.requestHandler(payload);
      }
      const res = await axios.get(url);
      dispatch({ type: "SET_ORDER_STATISTICS", payload: res.data.data });
      return res;
    } catch (err) {
      throw err;
    }
  },
  fetchOrderSummary: payload => async dispatch => {
    try {
      let url = "admin/dashboard/order-summary";
      if (payload) {
        url += appService.requestHandler(payload);
      }
      const res = await axios.get(url);
      dispatch({ type: "SET_ORDER_SUMMARY", payload: res.data.data });
      return res;
    } catch (err) {
      throw err;
    }
  },
  fetchSalesSummary: payload => async dispatch => {
    try {
      let url = "admin/dashboard/sales-summary";
      if (payload) {
        url += appService.requestHandler(payload);
      }
      const res = await axios.get(url);
      dispatch({ type: "SET_SALES_SUMMARY", payload: res.data.data });
      return res;
    } catch (err) {
      throw err;
    }
  },
  fetchCustomerStates: payload => async dispatch => {
    try {
      let url = "admin/dashboard/customer-states";
      if (payload) {
        url += appService.requestHandler(payload);
      }
      const res = await axios.get(url);
      dispatch({ type: "SET_CUSTOMER_STATES", payload: res.data.data });
      return res;
    } catch (err) {
      throw err;
    }
  },
  fetchTopProducts: () => async dispatch => {
    try {
      const res = await axios.get("admin/dashboard/top-products");
      dispatch({ type: "SET_TOP_PRODUCTS", payload: res.data.data });
      return res;
    } catch (err) {
      throw err;
    }
  },
  fetchTopCustomers: () => async dispatch => {
    try {
      const res = await axios.get("admin/dashboard/top-customers");
      dispatch({ type: "SET_TOP_CUSTOMERS", payload: res.data.data });
      return res;
    } catch (err) {
      throw err;
    }
  },
};
