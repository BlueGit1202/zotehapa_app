import axios from 'axios';

export const lists = (productId) => async (dispatch) => {
  try {
    dispatch({ type: 'PRODUCT_SEO_LIST_REQUEST' });
    const { data } = await axios.get(`admin/product/seo/${productId}`);
    dispatch({ type: 'PRODUCT_SEO_LIST_SUCCESS', payload: data.data });
  } catch (error) {
    dispatch({ 
      type: 'PRODUCT_SEO_LIST_FAIL', 
      payload: error.response?.data?.message || error.message 
    });
  }
};

export const save = (payload) => async (dispatch) => {
  try {
    dispatch({ type: 'PRODUCT_SEO_SAVE_REQUEST' });
    await axios.post(
      `/admin/product/seo/${payload.productId}/update`,
      payload.form
    );
    dispatch({ type: 'PRODUCT_SEO_SAVE_SUCCESS' });
    dispatch(lists(payload.productId));
  } catch (error) {
    dispatch({ 
      type: 'PRODUCT_SEO_SAVE_FAIL', 
      payload: error.response?.data?.message || error.message 
    });
  }
};