import axios from 'axios';
import appService from '../../../services/appService';

export const listPushNotifications = (payload) => async (dispatch) => {
  try {
    let url = 'admin/push-notification';
    if (payload) {
      url = url + appService.requestHandler(payload);
    }
    const res = await axios.get(url);
    if (typeof payload?.vuex === "undefined" || payload?.vuex === true) {
      dispatch({ type: 'SET_PUSH_NOTIFICATION_LISTS', payload: res.data.data });
      dispatch({ type: 'SET_PUSH_NOTIFICATION_PAGE', payload: res.data.meta });
      dispatch({ type: 'SET_PUSH_NOTIFICATION_PAGINATION', payload: res.data });
    }
    return res;
  } catch (err) {
    throw err;
  }
};

export const savePushNotification = (payload) => async (dispatch, getState) => {
  try {
    const { pushNotification } = getState();
    let method = axios.post;
    let url = '/admin/push-notification';
    if (pushNotification.temp.isEditing) {
      method = axios.post;
      url = `/admin/push-notification/${pushNotification.temp.temp_id}`;
    }

    const res = await method(url, payload.form);
    dispatch(listPushNotifications(payload.search));
    dispatch({ type: 'RESET_PUSH_NOTIFICATION' });
    return res;
  } catch (err) {
    throw err;
  }
};

export const editPushNotification = (payload) => async (dispatch) => {
  dispatch({ type: 'SET_PUSH_NOTIFICATION_TEMP', payload: payload });
};

export const destroyPushNotification = (payload) => async (dispatch) => {
  try {
    const res = await axios.delete(`admin/push-notification/${payload.id}`);
    dispatch(listPushNotifications(payload.search));
    return res;
  } catch (err) {
    throw err;
  }
};

export const showPushNotification = (payload) => async (dispatch) => {
  try {
    const res = await axios.get(`admin/push-notification/show/${payload}`);
    dispatch({ type: 'SET_PUSH_NOTIFICATION_SHOW', payload: res.data.data });
    return res;
  } catch (err) {
    throw err;
  }
};

export const exportPushNotifications = (payload) => async () => {
  try {
    let url = 'admin/push-notification/export';
    if (payload) {
      url = url + appService.requestHandler(payload);
    }
    const res = await axios.get(url, { responseType: 'blob' });
    return res;
  } catch (err) {
    throw err;
  }
};

export const resetPushNotification = () => async (dispatch) => {
  dispatch({ type: 'RESET_PUSH_NOTIFICATION' });
};