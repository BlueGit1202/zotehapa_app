import axios from "axios";
import appService from "../../../services/appService";

export const productAttributeActions = {
  lists: payload => async dispatch => {
    try {
      let url = "admin/setting/product-attribute";
      if (payload) {
        url = url + appService.requestHandler(payload);
      }
      const res = await axios.get(url);
      if (typeof payload.vuex === "undefined" || payload.vuex === true) {
        dispatch({
          type: "PRODUCT_ATTRIBUTE_LISTS",
          payload: res.data
        });
      }
      return res;
    } catch (err) {
      throw err;
    }
  },
  save: payload => async (dispatch, getState) => {
    try {
      const { temp } = getState().productAttribute;
      let method = axios.post;
      let url = "/admin/setting/product-attribute";
      if (temp.isEditing) {
        method = axios.put;
        url = `/admin/setting/product-attribute/${temp.temp_id}`;
      }
      const res = await method(url, payload.form);
      dispatch(productAttributeActions.lists(payload.search));
      dispatch({ type: "PRODUCT_ATTRIBUTE_RESET" });
      return res;
    } catch (err) {
      throw err;
    }
  },
  edit: payload => dispatch => {
    dispatch({
      type: "PRODUCT_ATTRIBUTE_TEMP",
      payload
    });
  },
  destroy: payload => async dispatch => {
    try {
      const res = await axios.delete(
        `admin/setting/product-attribute/${payload.id}`
      );
      dispatch(productAttributeActions.lists(payload.search));
      return res;
    } catch (err) {
      throw err;
    }
  },
  show: payload => async dispatch => {
    try {
      const res = await axios.get(
        `admin/setting/product-attribute/show/${payload}`
      );
      dispatch({
        type: "PRODUCT_ATTRIBUTE_SHOW",
        payload: res.data.data
      });
      return res;
    } catch (err) {
      throw err;
    }
  },
  reset: () => dispatch => {
    dispatch({ type: "PRODUCT_ATTRIBUTE_RESET" });
  }
};
