import axios from 'axios';

export const notificationAlertActions = {
  lists: () => async (dispatch) => {
    try {
      const res = await axios.get('admin/setting/notification-alert');
      dispatch({
        type: 'SET_NOTIFICATION_ALERT_DATA',
        payload: res.data.data,
      });
      return Promise.resolve(res);
    } catch (err) {
      return Promise.reject(err);
    }
  },

  save: (payload) => async (dispatch) => {
    try {
      const res = await axios.put('/admin/setting/notification-alert', payload.form);
      dispatch({
        type: 'SET_NOTIFICATION_ALERT_DATA',
        payload: res.data.data,
      });
      return Promise.resolve(res);
    } catch (err) {
      return Promise.reject(err);
    }
  },
};