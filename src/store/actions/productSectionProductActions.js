import axios from "axios";
import appService from "../../../services/appService";

export const listProductSectionProducts = payload => async dispatch => {
  try {
    let url = `admin/product-section/product/${payload.id}`;
    if (payload) {
      url = url + appService.requestHandler(payload);
    }
    const res = await axios.get(url);
    dispatch({ type: "PRODUCT_SECTION_PRODUCT_LIST", payload: res.data });
    return res;
  } catch (err) {
    throw err;
  }
};

export const saveProductSectionProduct = payload => async (
  dispatch,
  getState
) => {
  try {
    let method = axios.post;
    let url = `admin/product-section/product/${payload.id}`;
    const { temp } = getState().productSectionProduct;

    if (temp.isEditing) {
      method = axios.put;
      url = `${API_URL}admin/product-section/product/${payload.id}/${temp.temp_id}`;
    }

    const res = await method(url, payload.form);
    dispatch(listProductSectionProducts(payload.search));
    dispatch({ type: "PRODUCT_SECTION_PRODUCT_RESET" });
    return res;
  } catch (err) {
    throw err;
  }
};

export const destroyProductSectionProduct = (
  productSection,
  id,
  search
) => async dispatch => {
  try {
    const res = await axios.delete(
      `admin/product-section/product/${productSection}/${id}`
    );
    dispatch(listProductSectionProducts(search));
    return res;
  } catch (err) {
    throw err;
  }
};

export const resetProductSectionProduct = () => ({
  type: "PRODUCT_SECTION_PRODUCT_RESET"
});
