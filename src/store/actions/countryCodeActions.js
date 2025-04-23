export const fetchCountryCodes = () => async dispatch => {
  try {
    const res = await axios.get("admin/country-code");
    dispatch({ type: "COUNTRY_CODE/SET_LISTS", payload: res.data.data });
    return res;
  } catch (err) {
    throw err;
  }
};

export const fetchCountryCodeDetails = id => async dispatch => {
  try {
    const res = await axios.get(`admin/country-code/show/${id}`);
    dispatch({ type: "COUNTRY_CODE/SET_DETAILS", payload: res.data.data });
    return res;
  } catch (err) {
    throw err;
  }
};

export const fetchCallingCode = code => async dispatch => {
  try {
    const res = await axios.get(`admin/country-code/calling-code/${code}`);
    dispatch({ type: "COUNTRY_CODE/SET_DETAILS", payload: res.data.data });
    return res;
  } catch (err) {
    throw err;
  }
};
