import axios from 'axios';
import appService from '../../../services/appService';

export const listProducts = (search) => async (dispatch) => {
  try {
    dispatch({ type: 'PRODUCT_LIST_REQUEST' });
    let url = 'admin/product';
    if (search) {
      url = url + appService.requestHandler(search);
    }
    const { data } = await axios.get(url);
    dispatch({ type: 'PRODUCT_LIST_SUCCESS', payload: data });
    return data;
  } catch (error) {
    dispatch({ 
      type: 'PRODUCT_LIST_FAIL', 
      payload: error.response?.data?.message || error.message 
    });
  }
};

export const showProduct = (id) => async (dispatch) => {
  try {
    dispatch({ type: 'PRODUCT_SHOW_REQUEST' });
    const { data } = await axios.get(`admin/product/show/${id}`);
    dispatch({ type: 'PRODUCT_SHOW_SUCCESS', payload: data });
  } catch (error) {
    dispatch({ 
      type: 'PRODUCT_SHOW_FAIL', 
      payload: error.response?.data?.message || error.message 
    });
  }
};

export const saveProduct = payload => async (dispatch, getState) => {
  try {
    dispatch({ type: 'PRODUCT_SAVE_REQUEST' });
    const { temp } = getState().product;
    let url = temp.isEditing? `/admin/product/${temp.temp_id}`: '/admin/product';
    const res  = await axios.post(url, payload);
    
    dispatch({ type: 'PRODUCT_SAVE_SUCCESS', payload: res.data.data });
    dispatch(listProducts(props.search));
  } catch (error) {
    dispatch({ 
      type: 'PRODUCT_SAVE_FAIL', 
      payload: error.response?.data?.message || error.message 
    });
  }
  
};

export const editProduct = (payload) => async (dispatch) => {
  await dispatch({ type: "SET_PRODUCT_TEMP", payload });
};


export const deleteProduct = (payload) => async (dispatch) => {
  try {
    dispatch({ type: 'PRODUCT_DELETE_REQUEST' });
    await axios.delete(`admin/product/${payload}`);
    dispatch({ type: 'PRODUCT_DELETE_SUCCESS' });
    dispatch(listProducts(payload.search));
  } catch (error) {
    dispatch({ 
      type: 'PRODUCT_DELETE_FAIL', 
      payload: error.response?.data?.message || error.message 
    });
  }
};

export const uploadImage = (payload) => async (dispatch) => {
  try {
    dispatch({ type: 'PRODUCT_UPLOAD_IMAGE_REQUEST' });
    const { data } = await axios.post(
      `/admin/product/upload-image/${payload.id}`,
      payload.form,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    dispatch({ type: 'PRODUCT_UPLOAD_IMAGE_SUCCESS', payload: data });
  } catch (error) {
    dispatch({ 
      type: 'PRODUCT_UPLOAD_IMAGE_FAIL', 
      payload: error.response?.data?.message || error.message 
    });
  }
};

export const deleteImage = (payload) => async (dispatch) => {
  try {
    dispatch({ type: 'PRODUCT_DELETE_IMAGE_REQUEST' });
    const { data } = await axios.get(
      `/admin/product/delete-image/${payload.id}/${payload.index}`
    );
    dispatch({ type: 'PRODUCT_DELETE_IMAGE_SUCCESS', payload: data });
  } catch (error) {
    dispatch({ 
      type: 'PRODUCT_DELETE_IMAGE_FAIL', 
      payload: error.response?.data?.message || error.message 
    });
  }
};

export const shippingAndReturn = (payload) => async (dispatch) => {
  try {
    dispatch({ type: 'PRODUCT_SHIPPING_RETURN_REQUEST' });
    const { data } = await axios.post(
      `/admin/product/shipping-and-return/${payload.id}`,
      payload.form
    );
    dispatch({ type: 'PRODUCT_SHIPPING_RETURN_SUCCESS', payload: data });
  } catch (error) {
    dispatch({ 
      type: 'PRODUCT_SHIPPING_RETURN_FAIL', 
      payload: error.response?.data?.message || error.message 
    });
  }
};

export const productOffer = (payload) => async (dispatch) => {
  try {
    dispatch({ type: 'PRODUCT_OFFER_REQUEST' });
    const { data } = await axios.post(
      `/admin/product/offer/${payload.id}`,
      payload.form
    );
    dispatch({ type: 'PRODUCT_OFFER_SUCCESS', payload: data });
  } catch (error) {
    dispatch({ 
      type: 'PRODUCT_OFFER_FAIL', 
      payload: error.response?.data?.message || error.message 
    });
  }
};

export const getSku = () => async (dispatch) => {
  try {
    dispatch({ type: 'PRODUCT_SKU_REQUEST' });
    const res = await axios.get('admin/product/generate-sku');
    console.log(res.data.data.product_sku)
   res.data.data && dispatch({ type: 'PRODUCT_SKU_SUCCESS', payload: res.data.data });
  } catch (error) {
    dispatch({ 
      type: 'PRODUCT_SKU_FAIL', 
      payload: error.response?.data?.message || error.message 
    });
  }
};

export const exportProducts = (search) => async (dispatch) => {
  try {
    dispatch({ type: 'PRODUCT_EXPORT_REQUEST' });
    let url = 'admin/product/export';
    if (search) {
      url = url + appService.requestHandler(search);
    }
    const { data } = await axios.get(url, { responseType: 'blob' });
    dispatch({ type: 'PRODUCT_EXPORT_SUCCESS', payload: data });
  } catch (error) {
    dispatch({ 
      type: 'PRODUCT_EXPORT_FAIL', 
      payload: error.response?.data?.message || error.message 
    });
  }
};

export const getPurchasableProduct = () => async (dispatch) => {
  try {
    dispatch({ type: 'PRODUCT_PURCHASABLE_REQUEST' });
    const { data } = await axios.get('admin/product/purchasable-product');
    dispatch({ type: 'PRODUCT_PURCHASABLE_SUCCESS', payload: data.data });
  } catch (error) {
    dispatch({ 
      type: 'PRODUCT_PURCHASABLE_FAIL', 
      payload: error.response?.data?.message || error.message 
    });
  }
};

export const getSimpleProduct = () => async (dispatch) => {
  try {
    dispatch({ type: 'PRODUCT_SIMPLE_REQUEST' });
    const { data } = await axios.get('admin/product/simple-product');
    dispatch({ type: 'PRODUCT_SIMPLE_SUCCESS', payload: data.data });
  } catch (error) {
    dispatch({ 
      type: 'PRODUCT_SIMPLE_FAIL', 
      payload: error.response?.data?.message || error.message 
    });
  }
};

export const resetProduct = () => (dispatch) => {
  dispatch({ type: 'PRODUCT_RESET' });
};