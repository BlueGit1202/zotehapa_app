import axios from "axios";
import appService from "../../../../services/appService";

export const fetchOrders = payload => async dispatch => {
  try {
    let url = "frontend/order";
    if (payload) {
      url = url + appService.requestHandler(payload.search);
    }
    const res = await axios.get(url);

    if (typeof payload?.vuex === "undefined" || payload?.vuex === true) {
      dispatch({
        type: "SET_ORDER_LISTS",
        payload: res.data
      });

      if (payload?.search?.paginate === 1) {
        dispatch({
          type: "SET_ORDER_PAGINATION",
          payload: res.data
        });
      }
    }

    return Promise.resolve(res);
  } catch (err) {
    return Promise.reject(err);
  }
};

export const createOrder = payload => async dispatch => {
  try {
    const res = await axios.post("frontend/order", payload);
    return Promise.resolve(res);
  } catch (err) {
    return Promise.reject(err);
  }
};

export const fetchOrderDetails = id => async dispatch => {
  try {
    const res = await axios.get(`frontend/order/show/${id}`);

    dispatch({
      type: "SET_ORDER_DETAILS",
      payload: res.data
    });

    return Promise.resolve(res);
  } catch (err) {
    return Promise.reject(err);
  }
};

export const changeOrderStatus = payload => async dispatch => {
  try {
    const res = await axios.post(
      `frontend/order/change-status/${payload.id}`,
      payload
    );

    dispatch({
      type: "UPDATE_ORDER_STATUS",
      payload: res.data
    });

    return Promise.resolve(res);
  } catch (err) {
    return Promise.reject(err);
  }
};

export const getOrderDetails = id => async dispatch => {
  try {
    dispatch({ type: 'GET_ORDER_DETAILS_REQUEST' });
    
    const { data } = await axios.get(`frontend/order/show/${id}`);
    
    // Initialize products with isReturn and quantity fields
    console.log("order products data:", data)
    const productsWithReturnInfo = data.data.order_products.map(product => ({
      ...product,
      isReturn: false,
      quantity: 1
    }));
    
    dispatch({
      type: 'GET_ORDER_DETAILS_SUCCESS',
      payload: {
        ...data,
        data: {
          ...data.data,
          order_products: productsWithReturnInfo
        }
      }
    });
  } catch (error) {
    dispatch({
      type: 'GET_ORDER_DETAILS_FAIL',
      payload: error.response?.data?.message || error.message
    });
  }
};

export const updateOrderProducts = products => dispatch => {
  dispatch({
    type: 'UPDATE_ORDER_PRODUCTS',
    payload: products
  });
};

export const clearOrderDetails = () => dispatch => {
  dispatch({ type: 'CLEAR_ORDER_DETAILS' });
};