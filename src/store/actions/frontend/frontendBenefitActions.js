import axios from "axios";
import appService from "../../../../services/appService";

export const frontendBenefitActions = {
  lists: function(payload = {}) {
    return async (dispatch) => {
      try {
        let url = "frontend/benefit";
        if (payload) {
          url = url + appService.requestHandler(payload);
        }
        
        const res = await axios.get(url);
        
        if (typeof payload.vuex === "undefined" || payload.vuex === true) {
          dispatch({
            type: "BENEFIT_LISTS",
            payload: {
              data: res.data.data
            }
          });
        }
        
        return res;
      } catch (err) {
        throw err;
      }
    };
  },
  
  // Additional actions that match your reducer cases
  show: function(data) {
    return {
      type: "BENEFIT_SHOW",
      payload: data
    };
  },
  
  temp: function(data) {
    return {
      type: "BENEFIT_TEMP",
      payload: data
    };
  },
  
  reset: function() {
    return {
      type: "BENEFIT_RESET"
    };
  },
  
  // Paginated fetch action that matches your reducer
  fetchBenefits: function(payload = {}) {
    return async (dispatch) => {
      try {
        dispatch({ type: "FETCH_BENEFITS_REQUEST" });
        
        let url = "frontend/benefit";
        if (payload) {
          url = url + appService.requestHandler(payload);
        }
        
        const res = await axios.get(url);
        const page = payload.page || 1;
        const hasMore = res.data.data.length >= (payload.per_page || 10);
        
        dispatch({
          type: "FETCH_BENEFITS_SUCCESS",
          payload: {
            data: res.data.data,
            page,
            hasMore
          }
        });
        
        return res;
      } catch (err) {
        dispatch({
          type: "FETCH_BENEFITS_FAILURE",
          payload: err.response?.data?.message || err.message
        });
        throw err;
      }
    };
  }
};