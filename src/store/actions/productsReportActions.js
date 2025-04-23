import axios from "axios";
import appService from "../../../services/appService";

export const listProductsReports = payload => async dispatch => {
  try {
    let url = `admin/products-report`;
    if (payload) {
      url = url + appService.requestHandler(payload);
    }
    const res = await axios.get(url);
    dispatch({
      type: "PRODUCTS_REPORT_LIST",
      payload: {
        data: res.data.data,
        meta: res.data.meta,
        pagination: res.data
      }
    });
    return res;
  } catch (err) {
    throw err;
  }
};

export const exportProductsReports = payload => async dispatch => {
  try {
    let url = `admin/products-report/export`;
    if (payload) {
      url = url + appService.requestHandler(payload);
    }
    const res = await axios.get(url, { responseType: "blob" });

    // In React Native, you would use a library like react-native-fs to save the file
    // This is a simplified version - actual implementation would need file system access
    console.log("Export data received", res.data);

    return res;
  } catch (err) {
    throw err;
  }
};
