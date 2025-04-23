import axios from "axios"
import appService from '../../../services/appService';

export const fetchPosOrders = (params) => async (dispatch) => {
  try {
    dispatch({ type: 'FETCH_POS_ORDERS_REQUEST' });
    
    let url = 'admin/pos-order';
    if (params) {
      url += appService.requestHandler(params);
    }
    
    const { data } = await axios.get(url);
    
    dispatch({
      type: 'FETCH_POS_ORDERS_SUCCESS',
      payload: {
        data: data.data,
        pagination: data.meta,
      }
    });
  } catch (error) {
    dispatch({
      type: 'FETCH_POS_ORDERS_FAILURE',
      payload: error.response?.data?.message || error.message
    });
    throw error;
  }
};

export const fetchPosOrder = (id) => async (dispatch) => {
  try {
    dispatch({ type: 'FETCH_POS_ORDER_REQUEST' });
    
    const { data } = await axios.get(`admin/pos-order/show/${id}`);
    
    dispatch({
      type: 'FETCH_POS_ORDER_SUCCESS',
      payload: data.data
    });
  } catch (error) {
    dispatch({
      type: 'FETCH_POS_ORDER_FAILURE',
      payload: error.response?.data?.message || error.message
    });
    throw error;
  }
};

export const deletePosOrder = (id, searchParams) => async (dispatch) => {
  try {
    dispatch({ type: 'DELETE_POS_ORDER_REQUEST' });
    
    await axios.delete(`admin/pos-order/${id}`);
    
    dispatch({
      type: 'DELETE_POS_ORDER_SUCCESS',
      payload: id
    });
    
    // Refresh the list after deletion
    dispatch(fetchPosOrders(searchParams));
  } catch (error) {
    dispatch({
      type: 'DELETE_POS_ORDER_FAILURE',
      payload: error.response?.data?.message || error.message
    });
    throw error;
  }
};

export const changeOrderStatus = (payload) => async (dispatch) => {
  try {
    dispatch({ type: 'CHANGE_ORDER_STATUS_REQUEST' });
    
    const { data } = await axios.post(`admin/pos-order/change-status/${payload.id}`, payload);
    
    dispatch({
      type: 'CHANGE_ORDER_STATUS_SUCCESS',
      payload: data.data
    });
  } catch (error) {
    dispatch({
      type: 'CHANGE_ORDER_STATUS_FAILURE',
      payload: error.response?.data?.message || error.message
    });
    throw error;
  }
};

export const changePaymentStatus = (payload) => async (dispatch) => {
  try {
    dispatch({ type: 'CHANGE_PAYMENT_STATUS_REQUEST' });
    
    const { data } = await axios.post(`admin/pos-order/change-payment-status/${payload.id}`, payload);
    
    dispatch({
      type: 'CHANGE_PAYMENT_STATUS_SUCCESS',
      payload: data.data
    });
  } catch (error) {
    dispatch({
      type: 'CHANGE_PAYMENT_STATUS_FAILURE',
      payload: error.response?.data?.message || error.message
    });
    throw error;
  }
};

export const exportPosOrders = (params) => async (dispatch) => {
  try {
    dispatch({ type: 'EXPORT_POS_ORDERS_REQUEST' });
    
    let url = 'admin/pos-order/export';
    if (params) {
      url += appService.requestHandler(params);
    }
    
    const response = await axios.get(url, { responseType: 'blob' });
    
    // Handle file download in the component
    return response.data;
  } catch (error) {
    dispatch({
      type: 'EXPORT_POS_ORDERS_FAILURE',
      payload: error.response?.data?.message || error.message
    });
    throw error;
  }
};