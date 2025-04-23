// actions/frontendProductReviewActions.js
import axios from 'axios';

export const saveProductReview = (payload) => async (dispatch, getState) => {
  try {
    const { temp } = getState().frontendProductReview;
    let method = axios.post;
    let url = "/frontend/product-review";
    
    if (temp.isEditing) {
      method = axios.post;
      url = `/frontend/product-review/${temp.temp_id}`;
    }
    
    const res = await method(url, payload.form);
    
    dispatch({
      type: 'RESET_REVIEW'
    });
    
    return Promise.resolve(res);
  } catch (err) {
    return Promise.reject(err);
  }
};

export const editProductReview = (id) => ({
  type: 'SET_TEMP_REVIEW',
  payload: id
});

export const resetProductReview = () => ({
  type: 'RESET_REVIEW'
});

export const fetchProductReview = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`frontend/product-review/show/${id}`);
    
    dispatch({
      type: 'SET_PRODUCT_REVIEW',
      payload: res.data.data
    });
    
    return Promise.resolve(res);
  } catch (err) {
    return Promise.reject(err);
  }
};

export const uploadReviewImage = (id, formData) => async (dispatch) => {
  try {
    const res = await axios.post(
      `frontend/product-review/upload-image/${id}`, 
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    
    dispatch({
      type: 'SET_PRODUCT_REVIEW',
      payload: res.data.data
    });
    
    return Promise.resolve(res);
  } catch (err) {
    return Promise.reject(err);
  }
};

export const deleteReviewImage = (id, index) => async (dispatch) => {
  try {
    const res = await axios.get(`frontend/product-review/delete-image/${id}/${index}`);
    
    dispatch({
      type: 'SET_PRODUCT_REVIEW',
      payload: res.data.data
    });
    
    return Promise.resolve(res);
  } catch (err) {
    return Promise.reject(err);
  }
};