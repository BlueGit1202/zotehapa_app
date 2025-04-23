import axios from "axios";
import appService from "../../../../services/appService";

export const fetchLanguages = (payload = {}) => async dispatch => {
  try {
    dispatch({ type: "FETCH_LANGUAGES_REQUEST" });
    let url = "frontend/language";
    if (payload) url += appService.requestHandler(payload);
    const res = await axios.get(url);
    if (typeof payload.vuex === "undefined" || payload.vuex === true) {
      dispatch({ type: "FETCH_LANGUAGES_SUCCESS", payload: res.data.data });
    }
    return res.data;
  } catch (error) {
    dispatch({ type: "LANGUAGE_FAILURE", payload: error.message });
    throw error;
  }
};

export const fetchLanguage = id => async dispatch => {
  try {
    dispatch({ type: "FETCH_LANGUAGES_REQUEST" });
    const res = await axios.get(`frontend/language/show/${id}`);
    dispatch({ type: "FETCH_LANGUAGE_SUCCESS", payload: res.data.data });
    return res.data;
  } catch (error) {
    dispatch({ type: "LANGUAGE_FAILURE", payload: error.message });
    throw error;
  }
};

export const changeLanguage = (id, code, mode) => async dispatch => {
  try {
    await dispatch({
      type: "SET_LANGUAGE",
      payload: { language_id: id, language_code: code, display_mode: mode }
    });

    await dispatch(fetchLanguage(id));
    // You might want to reload translations here
  } catch (error) {
    console.error("Language change error:", error);
    throw error;
  }
};
