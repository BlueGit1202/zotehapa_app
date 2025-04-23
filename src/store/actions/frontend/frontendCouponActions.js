import axios from 'axios';
import appService from "../../../../services/appService";
export const fetchCoupons = (payload = {}) => async (dispatch) => {
  try {
    dispatch({ type: 'FETCH_COUPONS_REQUEST' });
    
    let url = "frontend/coupon";
    if (payload) {
      url += appService.requestHandler(payload);
    }
    
    const response = await axios.get(url);
    
    if (typeof payload.vuex === "undefined" || payload.vuex === true) {
      dispatch({
        type: 'FETCH_COUPONS_SUCCESS',
        payload: response.data.data
      });
    }
    
    return response.data;
  } catch (error) {
    dispatch({
      type: 'COUPON_FAILURE',
      payload: error.response?.data?.message || 'Failed to fetch coupons'
    });
    throw error;
  }
};

export const fetchCoupon = (id) => async (dispatch) => {
  try {
    dispatch({ type: 'FETCH_COUPONS_REQUEST' });
    const response = await axios.get(`frontend/coupon/show/${id}`);
    dispatch({
      type: 'FETCH_COUPON_SUCCESS',
      payload: response.data.data
    });
    return response.data;
  } catch (error) {
    dispatch({
      type: 'COUPON_FAILURE',
      payload: error.response?.data?.message || 'Failed to fetch coupon'
    });
    throw error;
  }
};

export const checkCoupon = (payload) => async (dispatch) => {
  try {
    dispatch({ type: 'COUPON_CHECKING_REQUEST' });
    const response = await axios.post(`frontend/coupon/coupon-checking`, payload);
    return response.data;
  } catch (error) {
    dispatch({
      type: 'COUPON_FAILURE',
      payload: error.response?.data?.message || 'Invalid coupon code'
    });
    throw error;
  }
};