import axios from "axios";
import appService from "../../../../services/appService";

export const fetchPages = (payload = {}) => async dispatch => {
  try {
    dispatch({ type: "FETCH_PAGES_REQUEST" });
    let url = "frontend/page";
    if (payload) url += appService.requestHandler(payload);
    const res = await axios.get(url);
    dispatch({ type: "FETCH_PAGES_SUCCESS", payload: res.data.data });
    return res.data;
  } catch (error) {
    dispatch({ type: "PAGE_FAILURE", payload: error.message });
    throw error;
  }
};

export const fetchPage = id => async dispatch => {
  try {
    dispatch({ type: "FETCH_PAGES_REQUEST" });
    const res = await axios.get(`frontend/page/show/${id}`);
    dispatch({ type: "FETCH_PAGE_SUCCESS", payload: res.data.data });
    return res.data;
  } catch (error) {
    dispatch({ type: "PAGE_FAILURE", payload: error.message });
    throw error;
  }
};

export const fetchPageInfo = id => async dispatch => {
  try {
    dispatch({ type: "FETCH_PAGES_REQUEST" });
    const res = await axios.get(`frontend/page/page-info/${id}`);
    dispatch({ type: "FETCH_PAGE_INFO_SUCCESS", payload: res.data.data });
    return res.data;
  } catch (error) {
    dispatch({ type: "PAGE_FAILURE", payload: error.message });
    throw error;
  }
};
