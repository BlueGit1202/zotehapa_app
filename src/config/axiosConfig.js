import axios from 'axios';
import ENV from './env';

export const configureAxios = (store) => {
  axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
  axios.defaults.baseURL = ENV.API_URL;
  axios.interceptors.request.use(
    (config) => {
      const state = store.getState();
      const token = state?.auth?.authToken;
      const languageCode = state?.globalState?.lists?.language_code;
      
      config.headers['x-api-key'] = ENV.API_KEY;
      
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      
      if (languageCode) {
        config.headers['x-localization'] = languageCode;
      }

      if (config.data instanceof FormData) {
            config.headers['Content-Type'] = 'multipart/form-data';
        } else {
            config.headers['Content-Type'] = 'application/json';
        }
      
      return config;
    },
    (error) => Promise.reject(error)
  );
};

// For real-time functionality in React Native, you would use:
// - Firebase Realtime Database
// - Socket.io client
// - Or other React Native compatible solutions