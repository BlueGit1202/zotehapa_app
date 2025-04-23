import axios from 'axios';
import appService from '../../../services/appService';

export const tree = (payload) => async (dispatch) => {
  try {
    dispatch({ type: 'PRODUCT_VARIATION_TREE_REQUEST' });
    let url = `admin/product/variation/${payload.productId}/tree`;
    if (payload) {
      url = url + appService.requestHandler(payload);
    }
    const { data } = await axios.get(url);
    dispatch({ type: 'PRODUCT_VARIATION_TREE_SUCCESS', payload: data.data });
  } catch (error) {
    dispatch({ 
      type: 'PRODUCT_VARIATION_TREE_FAIL', 
      payload: error.response?.data?.message || error.message 
    });
  }
};

export const singleTree = (productId) => async (dispatch) => {
  try {
    dispatch({ type: 'PRODUCT_VARIATION_SINGLE_TREE_REQUEST' });
    const { data } = await axios.get(`admin/product/variation/${productId}/single-tree`);
    dispatch({ type: 'PRODUCT_VARIATION_SINGLE_TREE_SUCCESS', payload: data.data });
  } catch (error) {
    dispatch({ 
      type: 'PRODUCT_VARIATION_SINGLE_TREE_FAIL', 
      payload: error.response?.data?.message || error.message 
    });
  }
};

export const treeWithSelected = (payload) => async (dispatch) => {
  try {
    dispatch({ type: 'PRODUCT_VARIATION_TREE_WITH_SELECTED_REQUEST' });
    let url = `admin/product/variation/${payload.productId}/tree-with-selected`;
    if (payload) {
      url = url + appService.requestHandler(payload);
    }
    const { data } = await axios.get(url);
    dispatch({ type: 'PRODUCT_VARIATION_TREE_WITH_SELECTED_SUCCESS', payload: data.data });
  } catch (error) {
    dispatch({ 
      type: 'PRODUCT_VARIATION_TREE_WITH_SELECTED_FAIL', 
      payload: error.response?.data?.message || error.message 
    });
  }
};

export const lists = (payload) => async (dispatch) => {
  try {
    dispatch({ type: 'PRODUCT_VARIATION_LIST_REQUEST' });
    let url = `admin/product/variation/${payload.productId}`;
    if (payload) {
      url = url + appService.requestHandler(payload);
    }
    const { data } = await axios.get(url);
    dispatch({ type: 'PRODUCT_VARIATION_LIST_SUCCESS', payload: data });
  } catch (error) {
    dispatch({ 
      type: 'PRODUCT_VARIATION_LIST_FAIL', 
      payload: error.response?.data?.message || error.message 
    });
  }
};

export const save = (payload) => async (dispatch, getState) => {
  try {
    dispatch({ type: 'PRODUCT_VARIATION_SAVE_REQUEST' });
    
    const { productVariation: { temp } } = getState();
    const method = temp.isEditing ? axios.put : axios.post;
    const url = temp.isEditing 
      ? `/admin/product/variation/${payload.productId}/update/${temp.temp_id}`
      : `/admin/product/variation/${payload.productId}/store`;
    
    await method(url, payload.form);
    dispatch({ type: 'PRODUCT_VARIATION_SAVE_SUCCESS' });
    dispatch(singleTree(payload.productId));
    dispatch(tree({ productId: payload.productId }));
    dispatch(lists({ productId: payload.productId }));
  } catch (error) {
    dispatch({ 
      type: 'PRODUCT_VARIATION_SAVE_FAIL', 
      payload: error.response?.data?.message || error.message 
    });
  }
};

export const edit = (payload) => async (dispatch) => {
  try {
    dispatch({ type: 'PRODUCT_VARIATION_EDIT_REQUEST' });
    let url = `admin/product/variation/${payload.productId}/tree`;
    if (payload) {
      url = url + appService.requestHandler(payload);
    }
    const { data } = await axios.get(url);
    dispatch({ 
      type: 'PRODUCT_VARIATION_EDIT_SUCCESS', 
      payload: { data: data.data, id: payload.id } 
    });
  } catch (error) {
    dispatch({ 
      type: 'PRODUCT_VARIATION_EDIT_FAIL', 
      payload: error.response?.data?.message || error.message 
    });
  }
};

export const destroy = (payload) => async (dispatch) => {
  try {
    dispatch({ type: 'PRODUCT_VARIATION_DELETE_REQUEST' });
    await axios.delete(
      `admin/product/variation/${payload.productId}/destroy/${payload.productVariationId}`
    );
    dispatch({ type: 'PRODUCT_VARIATION_DELETE_SUCCESS' });
    dispatch(singleTree(payload.productId));
    dispatch(tree({ productId: payload.productId }));
    dispatch(lists({ productId: payload.productId }));
  } catch (error) {
    dispatch({ 
      type: 'PRODUCT_VARIATION_DELETE_FAIL', 
      payload: error.response?.data?.message || error.message 
    });
  }
};

export const show = (payload) => async (dispatch) => {
  try {
    dispatch({ type: 'PRODUCT_VARIATION_SHOW_REQUEST' });
    const { data } = await axios.get(
      `admin/product/variation/${payload.productId}/show/${payload.productVariationId}`
    );
    dispatch({ type: 'PRODUCT_VARIATION_SHOW_SUCCESS', payload: data.data });
  } catch (error) {
    dispatch({ 
      type: 'PRODUCT_VARIATION_SHOW_FAIL', 
      payload: error.response?.data?.message || error.message 
    });
  }
};

export const initialVariation = (productId) => async (dispatch) => {
  try {
    dispatch({ type: 'PRODUCT_VARIATION_INITIAL_REQUEST' });
    const { data } = await axios.get(`admin/product/initial-variation/${productId}`);
    dispatch({ type: 'PRODUCT_VARIATION_INITIAL_SUCCESS', payload: data.data });
  } catch (error) {
    dispatch({ 
      type: 'PRODUCT_VARIATION_INITIAL_FAIL', 
      payload: error.response?.data?.message || error.message 
    });
  }
};

export const childrenVariation = (productId) => async (dispatch) => {
  try {
    dispatch({ type: 'PRODUCT_VARIATION_CHILDREN_REQUEST' });
    const { data } = await axios.get(`admin/product/children-variation/${productId}`);
    dispatch({ type: 'PRODUCT_VARIATION_CHILDREN_SUCCESS', payload: data.data });
  } catch (error) {
    dispatch({ 
      type: 'PRODUCT_VARIATION_CHILDREN_FAIL', 
      payload: error.response?.data?.message || error.message 
    });
  }
};

export const ancestorsToString = (productId) => async (dispatch) => {
  try {
    dispatch({ type: 'PRODUCT_VARIATION_ANCESTORS_REQUEST' });
    const { data } = await axios.get(
      `admin/product/variation/ancestors-and-self/${productId}`
    );
    dispatch({ type: 'PRODUCT_VARIATION_ANCESTORS_SUCCESS', payload: data.data });
  } catch (error) {
    dispatch({ 
      type: 'PRODUCT_VARIATION_ANCESTORS_FAIL', 
      payload: error.response?.data?.message || error.message 
    });
  }
};

export const ancestorsAndSelfId = (productId) => async (dispatch) => {
  try {
    dispatch({ type: 'PRODUCT_VARIATION_ANCESTORS_ID_REQUEST' });
    const { data } = await axios.get(`admin/product/ancestors-and-self-id/${productId}`);
    dispatch({ type: 'PRODUCT_VARIATION_ANCESTORS_ID_SUCCESS', payload: data.data });
  } catch (error) {
    dispatch({ 
      type: 'PRODUCT_VARIATION_ANCESTORS_ID_FAIL', 
      payload: error.response?.data?.message || error.message 
    });
  }
};

export const reset = () => (dispatch) => {
  dispatch({ type: 'PRODUCT_VARIATION_RESET' });
};