import axios from "axios";
import appService from "../../../services/appService";

export const productCategoryActions = {
  depthTrees: () => async dispatch => {
    try {
      const res = await axios.get("admin/setting/product-category/depth-tree");
      dispatch({
        type: "PRODUCT_CATEGORY_DEPTH_TREES",
        payload: res.data.data
      });
      return res;
    } catch (err) {
      throw err;
    }
  },
  lists: payload => async dispatch => {
    try {
      let url = "admin/setting/product-category";
      if (payload) {
        url = url + appService.requestHandler(payload);
      }
      const res = await axios.get(url);

        dispatch({
          type: "PRODUCT_CATEGORY_LISTS",
          payload: res.data
        });
      return res;
    } catch (err) {
      throw err;
    }
  },
  save: payload => async (dispatch, getState) => {
    try {
      const { temp } = getState().productCategory;
      let method = axios.post;
      let url = "/admin/setting/product-category";
      if (temp.isEditing) {
        method = axios.post;
        url = `/admin/setting/product-category/${temp.temp_id}`;
      }
      const res = await method(url, payload.form);
      dispatch(productCategoryActions.lists(payload.search));
      dispatch(productCategoryActions.depthTrees());
      dispatch({ type: "PRODUCT_CATEGORY_RESET" });
      return res;
    } catch (err) {
      throw err;
    }
  },
  edit: payload => dispatch => {
    dispatch({
      type: "PRODUCT_CATEGORY_TEMP",
      payload
    });
  },
  destroy: payload => async dispatch => {
    try {
      const res = await axios.delete(
        `admin/setting/product-category/${payload.id}`
      );
      dispatch(productCategoryActions.lists(payload.search));
      dispatch(productCategoryActions.depthTrees());
      return res;
    } catch (err) {
      throw err;
    }
  },
  show: payload => async dispatch => {
    try {
      const res = await axios.get(
        `admin/setting/product-category/show/${payload}`
      );
      dispatch({
        type: "PRODUCT_CATEGORY_SHOW",
        payload: res.data.data
      });
      return res;
    } catch (err) {
      throw err;
    }
  },
  reset: () => dispatch => {
    dispatch({ type: "PRODUCT_CATEGORY_RESET" });
  }
};
