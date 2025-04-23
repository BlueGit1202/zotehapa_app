import axios from 'axios';
import appService from '../../../services/appService';

export const pageActions = {
  lists: (payload) => async (dispatch) => {
    try {
      let url = 'admin/setting/page';
      if (payload) {
        url = url + appService.requestHandler(payload);
      }
      const res = await axios.get(url);
      dispatch({
        type: 'SET_PAGE_DATA',
        payload: res.data
      });
      dispatch({
        type: 'SET_PAGE',
        payload: payload?.page || 1
      });
      return Promise.resolve(res);
    } catch (err) {
      return Promise.reject(err);
    }
  },

  save: (payload) => async (dispatch) => {
    try {
      const method = payload.id ? 'put' : 'post';
      const url = payload.id ? `/admin/setting/page/${payload.id}` : '/admin/setting/page';
      
      const res = await axios[method](url, payload.form);
      dispatch({
        type: 'SET_PAGE_TEMP',
        payload: res.data.data.id
      });
      return Promise.resolve(res);
    } catch (err) {
      return Promise.reject(err);
    }
  },

  show: (id) => async (dispatch) => {
    try {
      const res = await axios.get(`admin/setting/page/show/${id}`);
      dispatch({
        type: 'SET_PAGE_SHOW',
        payload: res.data.data
      });
      return Promise.resolve(res);
    } catch (err) {
      return Promise.reject(err);
    }
  },

  destroy: (id) => async (dispatch) => {
    try {
      const res = await axios.delete(`admin/setting/page/${id}`);
      return Promise.resolve(res);
    } catch (err) {
      return Promise.reject(err);
    }
  },

  reset: () => async (dispatch) => {
    dispatch({
      type: 'RESET_PAGE'
    });
  }
};