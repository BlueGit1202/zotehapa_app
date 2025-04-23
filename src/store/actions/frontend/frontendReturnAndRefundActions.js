import axios from "axios";
import appService from "../../../../services/appService";

export const fetchReturns = (payload = {}) => async dispatch => {
  try {
    dispatch({ type: "RETURN_REQUEST" });
    let url = "frontend/return-order";
    if (payload) url += appService.requestHandler(payload.search);
    const res = await axios.get(url);
    if (typeof payload.vuex === "undefined" || payload.vuex === true) {
      dispatch({
        type: "FETCH_RETURNS_SUCCESS",
        payload: {
          lists: res.data.data,
          page: res.data.meta,
          pagination: res.data
        }
      });
    }
    return res.data;
  } catch (error) {
    dispatch({ type: "RETURN_FAILURE", payload: error.message });
    throw error;
  }
};

export const createReturnRequest = (id, formData) => async dispatch => {
  try {
    dispatch({ type: "RETURN_REQUEST" });
    const res = await axios.post(
      `/frontend/return-order/request/${id}`,
      formData
    );
    return res.data;
  } catch (error) {
    dispatch({ type: "RETURN_FAILURE", payload: error.message });
    throw error;
  }
};

export const fetchReturn = id => async dispatch => {
  try {
    dispatch({ type: "RETURN_REQUEST" });
    const res = await axios.get(`frontend/return-order/show/${id}`);
    dispatch({
      type: "FETCH_RETURN_SUCCESS",
      payload: {
        return: res.data.data,
        products: res.data.data.return_products
      }
    });
    return res.data;
  } catch (error) {
    dispatch({ type: "RETURN_FAILURE", payload: error.message });
    throw error;
  }
};

export const getReturnOrders = (params = {}) => async (dispatch) => {
  try {
    dispatch({ type: 'GET_RETURN_ORDERS_REQUEST' });
    
    const { data } = await axios.get(`frontend/return-order`, { 
      params: {
        page: params.page || 1,
        per_page: 10,
        order_column: 'id',
        order_by: 'desc'
      }
    });
    
    dispatch({
      type: 'GET_RETURN_ORDERS_SUCCESS',
      payload: data
    });
  } catch (error) {
    dispatch({
      type: 'GET_RETURN_ORDERS_FAIL',
      payload: error.response?.data?.message || error.message
    });
  }
};

// Get return order details
export const getReturnOrderDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: 'GET_RETURN_ORDER_DETAILS_REQUEST' });
    
    const { data } = await axios.get(`frontend/return-order/${id}`);
    
    dispatch({
      type: 'GET_RETURN_ORDER_DETAILS_SUCCESS',
      payload: data
    });
  } catch (error) {
    dispatch({
      type: 'GET_RETURN_ORDER_DETAILS_FAIL',
      payload: error.response?.data?.message || error.message
    });
  }
};

// Submit return request
export const submitReturnRequest = (payload) => async (dispatch) => {
  try {
    dispatch({ type: 'SUBMIT_RETURN_REQUEST_REQUEST' });
    
    const { data } = await axios.post(
      `frontend/return-order/${payload.id}`, 
      payload.form,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    
    dispatch({
      type: 'SUBMIT_RETURN_REQUEST_SUCCESS',
      payload: data
    });
    
    // Navigate to return orders list
    if (payload.navigation) {
      payload.navigation.navigate('ReturnOrder');
    }
  } catch (error) {
    dispatch({
      type: 'SUBMIT_RETURN_REQUEST_FAIL',
      payload: error.response?.data?.errors || error.response?.data?.message || error.message
    });
  }
};

// Clear errors
export const clearReturnErrors = () => (dispatch) => {
  dispatch({ type: 'CLEAR_RETURN_ERRORS' });
};
