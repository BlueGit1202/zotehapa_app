import axios from "axios";
import appService from "../../../services/appService";

export const fetchBarcode = payload => async dispatch => {
  try {
    let url = "admin/setting/barcode";
    if (payload) url += appService.requestHandler(payload);
    const res = await axios.get(url);
    dispatch({ type: "BARCODE_SET_LIST", payload: res.data });
    return res;
  } catch (err) {
    throw err;
  }
};
