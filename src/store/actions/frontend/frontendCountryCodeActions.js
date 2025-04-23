import axios from 'axios';

export const fetchCountryCodes = () => async (dispatch) => {
  try {
    dispatch({ type: 'FETCH_COUNTRY_CODES_REQUEST' });
    const response = await axios.get("frontend/country-code");
    dispatch({
      type: 'FETCH_COUNTRY_CODES_SUCCESS',
      payload: response.data.data
    });
    return response.data;
  } catch (error) {
    dispatch({
      type: 'COUNTRY_CODE_FAILURE',
      payload: error.response?.data?.message || 'Failed to fetch country codes'
    });
    throw error;
  }
};

export const fetchCountryCode = (id) => async (dispatch) => {
  try {
    dispatch({ type: 'FETCH_COUNTRY_CODES_REQUEST' });
    const response = await axios.get(`frontend/country-code/show/${id}`);
    dispatch({
      type: 'FETCH_COUNTRY_CODE_SUCCESS',
      payload: response.data.data
    });
    return response.data;
  } catch (error) {
    dispatch({
      type: 'COUNTRY_CODE_FAILURE',
      payload: error.response?.data?.message || 'Failed to fetch country code'
    });
    throw error;
  }
};

export const fetchCallingCode = (code) => async (dispatch) => {
  try {
    dispatch({ type: 'FETCH_COUNTRY_CODES_REQUEST' });
    const response = await axios.get(`frontend/country-code/calling-code/${code}`);
    dispatch({
      type: 'FETCH_CALLING_CODE_SUCCESS',
      payload: response.data.data
    });
    return response.data;
  } catch (error) {
    dispatch({
      type: 'COUNTRY_CODE_FAILURE',
      payload: error.response?.data?.message || 'Failed to fetch calling code'
    });
    throw error;
  }
};