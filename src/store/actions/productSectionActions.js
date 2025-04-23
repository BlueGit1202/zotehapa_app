import axios from "axios";
import appService from "../../../services/appService";

export const listProductSections = payload => async dispatch => {
  try {
    let url = `admin/product-section`;
    if (payload) {
      url = url + appService.requestHandler(payload);
    }
    const res = await axios.get(url);
    dispatch({ type: "PRODUCT_SECTION_LIST", payload: res.data });
    return res;
  } catch (err) {
    throw err;
  }
};

export const showProductSection = id => async dispatch => {
  try {
    const res = await axios.get(`admin/product-section/show/${id}`);
    dispatch({ type: "PRODUCT_SECTION_SHOW", payload: res.data });
    return res;
  } catch (err) {
    throw err;
  }
};

export const saveProductSection = payload => async (dispatch, getState) => {
  try {
    let method = axios.post;
    let url = `admin/product-section`;
    const { temp } = getState().productSection;

    if (temp.isEditing) {
      method = axios.post;
      url = `admin/product-section/${temp.temp_id}`;
    }

    const res = await method(url, payload.form);
    dispatch(listProductSections(payload.search));
    dispatch({ type: "PRODUCT_SECTION_RESET" });
    return res;
  } catch (err) {
    throw err;
  }
};

export const destroyProductSection = (id, search) => async dispatch => {
  try {
    const res = await axios.delete(`admin/product-section/${id}`);
    dispatch(listProductSections(search));
    return res;
  } catch (err) {
    throw err;
  }
};

export const resetProductSection = () => ({ type: "PRODUCT_SECTION_RESET" });
