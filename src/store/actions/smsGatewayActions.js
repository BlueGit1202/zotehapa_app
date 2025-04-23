import axios from "axios";
import appService from "../../../services/appService";

const smsGatewayActions = {
  lists: search => async dispatch => {
    try {
      dispatch({ type: "smsGateway/listsRequest" });

      let url = "admin/setting/sms-gateway";
      if (search) {
        url += appService.requestHandler(search);
      }

      const response = await axios.get(url);
      dispatch({ type: "smsGateway/listsSuccess", payload: response.data });
      return response.data;
    } catch (error) {
      dispatch({
        type: "smsGateway/listsFailure",
        payload: error.response.data
      });
      throw error;
    }
  },

  save: data => async dispatch => {
    try {
      dispatch({ type: "smsGateway/saveRequest" });
      const response = await axios.put("admin/setting/sms-gateway", data.form);

      dispatch({ type: "smsGateway/saveSuccess", payload: response.data.data });
      dispatch(smsGatewayActions.lists(data.search));
      return response.data;
    } catch (error) {
      dispatch({
        type: "smsGateway/saveFailure",
        payload: error.response.data
      });
      throw error;
    }
  }
};

export default smsGatewayActions;
