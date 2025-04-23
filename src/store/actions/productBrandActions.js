import axios from "axios";
import appService from "../../../services/appService";

export const productBrandActions = {
  lists: payload => async dispatch => {
    try {
      let url = "admin/setting/product-brand";
      if (payload) {
        url = url + appService.requestHandler(payload);
      }
      const res = await axios.get(url);
        dispatch({
          type: "PRODUCT_BRAND_LISTS",
          payload: res.data
        });
      return res;
    } catch (err) {
      throw err;
    }
  },
  save: payload => async (dispatch, getState) => {
    try {
      const { temp } = getState().productBrand;
      let method = axios.post;
      let url = "/admin/setting/product-brand";
      if (temp.isEditing) {
        method = axios.post;
        url = `/admin/setting/product-brand/${temp.temp_id}`;
      }
      const res = await method(url, payload.form);
      dispatch(productBrandActions.lists(payload.search));
      dispatch({ type: "PRODUCT_BRAND_RESET" });
      return res;
    } catch (err) {
      throw err;
    }
  },
  edit: payload => dispatch => {
    dispatch({
      type: "PRODUCT_BRAND_TEMP",
      payload
    });
  },
  destroy: payload => async dispatch => {
    try {
      const res = await axios.delete(
        `admin/setting/product-brand/${payload.id}`
      );
      dispatch(productBrandActions.lists(payload.search));
      return res;
    } catch (err) {
      throw err;
    }
  },
  show: payload => async dispatch => {
    try {
      const res = await axios.get(
        `admin/setting/product-brand/show/${payload}`
      );
      dispatch({
        type: "PRODUCT_BRAND_SHOW",
        payload: res.data.data
      });
      return res;
    } catch (err) {
      throw err;
    }
  },
  reset: () => dispatch => {
    dispatch({ type: "PRODUCT_BRAND_RESET" });
  }
};
