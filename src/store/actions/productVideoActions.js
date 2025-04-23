import axios from 'axios';
import appService from '../../../services/appService';

export const lists = (payload) => async (dispatch) => {
  try {
    dispatch({ type: 'PRODUCT_VIDEO_LIST_REQUEST' });
    let url = `admin/product/video/${payload.productId}`;
    if (payload.search) {
      url = url + appService.requestHandler(payload.search);
    }
    const { data } = await axios.get(url);
    dispatch({ type: 'PRODUCT_VIDEO_LIST_SUCCESS', payload: data });
  } catch (error) {
    dispatch({ 
      type: 'PRODUCT_VIDEO_LIST_FAIL', 
      payload: error.response?.data?.message || error.message 
    });
  }
};

export const save = (payload) => async (dispatch, getState) => {
  try {
    dispatch({ type: 'PRODUCT_VIDEO_SAVE_REQUEST' });
    
    const { productVideo: { temp } } = getState();
    const method = temp.isEditing ? axios.put : axios.post;
    const url = temp.isEditing 
      ? `/admin/product/video/${payload.productId}/${temp.temp_id}`
      : `/admin/product/video/${payload.productId}`;
    
    await method(url, payload.form);
    dispatch({ type: 'PRODUCT_VIDEO_SAVE_SUCCESS' });
    dispatch(lists(payload));
  } catch (error) {
    dispatch({ 
      type: 'PRODUCT_VIDEO_SAVE_FAIL', 
      payload: error.response?.data?.message || error.message 
    });
  }
};

export const edit = (videoId) => async (dispatch) => {
  try {
    dispatch({ type: 'PRODUCT_VIDEO_EDIT_REQUEST' });
    dispatch({ type: 'PRODUCT_VIDEO_EDIT_SUCCESS', payload: videoId });
  } catch (error) {
    dispatch({ 
      type: 'PRODUCT_VIDEO_EDIT_FAIL', 
      payload: error.response?.data?.message || error.message 
    });
  }
};

export const destroy = (payload) => async (dispatch) => {
  try {
    dispatch({ type: 'PRODUCT_VIDEO_DELETE_REQUEST' });
    await axios.delete(
      `admin/product/video/${payload.productId}/${payload.id}`
    );
    dispatch({ type: 'PRODUCT_VIDEO_DELETE_SUCCESS' });
    dispatch(lists({
      productId: payload.productId,
      search: payload.search
    }));
  } catch (error) {
    dispatch({ 
      type: 'PRODUCT_VIDEO_DELETE_FAIL', 
      payload: error.response?.data?.message || error.message 
    });
  }
};

export const reset = () => (dispatch) => {
  dispatch({ type: 'PRODUCT_VIDEO_RESET' });
};