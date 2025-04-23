import axios from "axios";
import appService from "../../../services/appService";

export const productAttributeOptionActions = {
  lists: payload => async dispatch => {
    try {
      let url = "admin/setting/product-attribute-option";
      if (payload) {
        url = url + appService.requestHandler(payload);
      }
      const res = await axios.get(url);
      if (typeof payload.vuex === "undefined" || payload.vuex === true) {
        dispatch({
          type: "PRODUCT_ATTRIBUTE_OPTION_LISTS",
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
      const { temp } = getState().productAttributeOption;
      let method = axios.post;
      let url = "/admin/setting/product-attribute-option";
      if (temp.isEditing) {
        method = axios.put;
        url = `/admin/setting/product-attribute-option/${temp.temp_id}`;
      }
      const res = await method(url, {
        ...payload.form,
        attribute_id: payload.attributeId
      });
      dispatch(productAttributeOptionActions.lists(payload.search));
      dispatch({ type: "PRODUCT_ATTRIBUTE_OPTION_RESET" });
      return res;
    } catch (err) {
      throw err;
    }
  },
  edit: payload => dispatch => {
    dispatch({
      type: "PRODUCT_ATTRIBUTE_OPTION_TEMP",
      payload
    });
  },
  destroy: payload => async dispatch => {
    try {
      const res = await axios.delete(
        `admin/setting/product-attribute-option/${payload.id}`
      );
      dispatch(productAttributeOptionActions.lists(payload.search));
      return res;
    } catch (err) {
      throw err;
    }
  },
  reset: () => dispatch => {
    dispatch({ type: "PRODUCT_ATTRIBUTE_OPTION_RESET" });
  }
};
