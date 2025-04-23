// Actions
import appService from "../../../services/appService";
export const fetchUsers = (payload) => async (dispatch) => {
  try {
    let url = "admin/users";
    if (payload) url += appService.requestHandler(payload);
    const res = await axios.get(url);
    
    if (!payload?.vuex || payload.vuex === true) {
      dispatch({ type: 'SET_USERS', payload: res.data.data });
      dispatch({ type: 'SET_USER_PAGE', payload: res.data.meta });
      dispatch({ type: 'SET_USER_PAGINATION', payload: res.data });
    }
    return res;
  } catch (err) {
    throw err;
  }
};

