import axios from 'axios';

export const otpActions = {
  lists: () => async (dispatch) => {
    try {
      const res = await axios.get('admin/setting/otp');
      dispatch({
        type: 'SET_OTP_DATA',
        payload: res.data.data,
      });
      return Promise.resolve(res);
    } catch (err) {
      return Promise.reject(err);
    }
  },

  save: (payload) => async (dispatch) => {
    try {
      const res = await axios.put('/admin/setting/otp', payload);
      dispatch({
        type: 'SET_OTP_DATA',
        payload: payload,
      });
      return Promise.resolve(res);
    } catch (err) {
      return Promise.reject(err);
    }
  },
};