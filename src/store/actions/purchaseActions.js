import axios from 'axios';
import appService from '../../../services/appService';

export const listPurchases = (payload) => async (dispatch) => {
  try {
    let url = 'admin/purchase';
    if (payload) {
      url = url + appService.requestHandler(payload);
    }
    const res = await axios.get(url);
    if (typeof payload?.vuex === "undefined" || payload?.vuex === true) {
      dispatch({ type: 'SET_PURCHASE_LISTS', payload: res.data.data });
      dispatch({ type: 'SET_PURCHASE_PAGE', payload: res.data.meta });
      dispatch({ type: 'SET_PURCHASE_PAGINATION', payload: res.data });
    }
    return res;
  } catch (err) {
    throw err;
  }
};

export const savePurchase = (payload) => async (dispatch, getState) => {
  try {
    const { purchase } = getState();
    let method = axios.post;
    let url = 'admin/purchase';
    if (purchase.temp.isEditing) {
      method = axios.post;
      url = `admin/purchase/update/${purchase.temp.temp_id}`;
    }

    const res = await method(url, payload.form);
    dispatch(listPurchases({ vuex: true }));
    dispatch({ type: 'RESET_PURCHASE' });
    return res;
  } catch (err) {
    throw err;
  }
};

export const showPurchase = (payload) => async (dispatch) => {
  try {
    const res = await axios.get(`admin/purchase/show/${payload}`);
    dispatch({ type: 'SET_PURCHASE_SHOW', payload: res.data.data });
    return res;
  } catch (err) {
    throw err;
  }
};

export const editPurchase = (payload) => async (dispatch) => {
  try {
    const res = await axios.get(`admin/purchase/edit/${payload}`);
    dispatch({ type: 'SET_PURCHASE_EDIT', payload: res.data.data });
    dispatch({ type: 'SET_PURCHASE_TEMP', payload: payload });
    return res;
  } catch (err) {
    throw err;
  }
};

export const destroyPurchase = (payload) => async (dispatch) => {
  try {
    const res = await axios.delete(`admin/purchase/${payload.id}`);
    dispatch(listPurchases(payload.search));
    return res;
  } catch (err) {
    throw err;
  }
};

export const exportPurchases = (payload) => async () => {
  try {
    let url = 'admin/purchase/export';
    if (payload) {
      url = url + appService.requestHandler(payload);
    }
    const res = await axios.get(url, { responseType: 'blob' });
    return res;
  } catch (err) {
    throw err;
  }
};

export const downloadPurchaseAttachment = (payload) => async () => {
  try {
    const url = 'admin/purchase/download-attachment/' + payload;
    const res = await axios.get(url, { responseType: 'blob' });
    return res;
  } catch (err) {
    throw err;
  }
};

export const setPurchasePayment = (payload) => async (dispatch) => {
  dispatch({ type: 'SET_PURCHASE_TEMP', payload: payload });
};

export const addPurchasePayment = (payload) => async (dispatch, getState) => {
  try {
    const { purchase } = getState();
    const method = axios.post;
    const url = `admin/purchase/payment/${purchase.temp.temp_id}`;

    const res = await method(url, payload.form);
    dispatch(listPurchases({ vuex: true }));
    dispatch({ type: 'RESET_PURCHASE' });
    return res;
  } catch (err) {
    throw err;
  }
};

export const viewPurchasePayment = () => async (dispatch, getState) => {
  try {
    const { purchase } = getState();
    const res = await axios.get(`admin/purchase/payment/${purchase.temp.temp_id}`);
    dispatch({ type: 'SET_PURCHASE_VIEW_PAYMENT', payload: res.data.data });
    return res;
  } catch (err) {
    throw err;
  }
};

export const destroyPurchasePayment = (payload) => async (dispatch) => {
  try {
    const res = await axios.delete(`admin/purchase/payment/${payload.purchase_id}/${payload.id}`);
    dispatch(listPurchases(payload.search));
    return res;
  } catch (err) {
    throw err;
  }
};

export const downloadPurchasePaymentAttachment = (payload) => async () => {
  try {
    const url = 'admin/purchase/payment/download-attachment/' + payload;
    const res = await axios.get(url, { responseType: 'blob' });
    return res;
  } catch (err) {
    throw err;
  }
};

export const resetPurchase = () => async (dispatch) => {
  dispatch({ type: 'RESET_PURCHASE' });
};