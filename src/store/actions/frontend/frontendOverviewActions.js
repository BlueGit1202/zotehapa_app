import axios from 'axios';


// Get total orders
export const getTotalOrders = () => async (dispatch) => {
  try {
    dispatch({ type: 'GET_TOTAL_ORDERS_REQUEST' });
    
    const { data } = await axios.get(`frontend/overview/total-orders`);
    
    dispatch({
      type: 'GET_TOTAL_ORDERS_SUCCESS',
      payload: data.data.total_orders
    });
  } catch (error) {
    dispatch({
      type: 'GET_TOTAL_ORDERS_FAIL',
      payload: error.response?.data?.message || error.message
    });
  }
};

// Get total completed orders
export const getTotalCompletedOrders = () => async (dispatch) => {
  try {
    dispatch({ type: 'GET_TOTAL_COMPLETED_ORDERS_REQUEST' });
    
    const { data } = await axios.get(`frontend/overview/total-complete-orders`);
    
    dispatch({
      type: 'GET_TOTAL_COMPLETED_ORDERS_SUCCESS',
      payload: data.data.total_completed_orders
    });
  } catch (error) {
    dispatch({
      type: 'GET_TOTAL_COMPLETED_ORDERS_FAIL',
      payload: error.response?.data?.message || error.message
    });
  }
};

// Get total returned orders
export const getTotalReturnedOrders = () => async (dispatch) => {
  try {
    dispatch({ type: 'GET_TOTAL_RETURNED_ORDERS_REQUEST' });
    
    const { data } = await axios.get(`frontend/overview/total-return-orders`);
    
    dispatch({
      type: 'GET_TOTAL_RETURNED_ORDERS_SUCCESS',
      payload: data.data.total_returned_orders
    });
  } catch (error) {
    dispatch({
      type: 'GET_TOTAL_RETURNED_ORDERS_FAIL',
      payload: error.response?.data?.message || error.message
    });
  }
};

// Get wallet balance
export const getWalletBalance = () => async (dispatch) => {
  try {
    dispatch({ type: 'GET_WALLET_BALANCE_REQUEST' });
    
    const { data } = await axios.get(`frontend/overview/wallet-balance`);
    
    dispatch({
      type: 'GET_WALLET_BALANCE_SUCCESS',
      payload: data.data.wallet_balance
    });
  } catch (error) {
    dispatch({
      type: 'GET_WALLET_BALANCE_FAIL',
      payload: error.response?.data?.message || error.message
    });
  }
};

// Get order lists
export const getOrderLists = (params) => async (dispatch) => {
  try {
    dispatch({ type: 'GET_ORDER_LISTS_REQUEST' });
    
    const { data } = await axios.get(`frontend/order/lists`, { params });
    
    dispatch({
      type: 'GET_ORDER_LISTS_SUCCESS',
      payload: data.data
    });
  } catch (error) {
    dispatch({
      type: 'GET_ORDER_LISTS_FAIL',
      payload: error.response?.data?.message || error.message
    });
  }
};