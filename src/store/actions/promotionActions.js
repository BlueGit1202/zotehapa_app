import axios from "axios";

export const listPromotions = payload => async dispatch => {
  try {
    let url = `admin/promotion`;
    if (payload) {
      url += `?${Object.keys(payload)
        .map(key => `${key}=${payload[key]}`)
        .join("&")}`;
    }
    const res = await axios.get(url);
    dispatch({ type: "PROMOTION_LIST", payload: res.data });
    return res;
  } catch (err) {
    throw err;
  }
};

export const showPromotion = id => async dispatch => {
  try {
    const res = await axios.get(`admin/promotion/show/${id}`);
    dispatch({ type: "PROMOTION_SHOW", payload: res.data });
    return res;
  } catch (err) {
    throw err;
  }
};

export const startEditPromotion = promotionData => dispatch => {
  dispatch({
    type: "PROMOTION_EDIT_START",
    payload: {
      id: promotionData.id,
      data: promotionData
    }
  });
};

// Action to save promotion (handles both create and update)
export const savePromotion = payload => async (dispatch, getState) => {
  dispatch({ type: "PROMOTION_SAVING" });

  try {
    const { promotion } = getState();
    let url = `admin/promotion`;
    let method = axios.post;

    if (promotion.temp.isEditing) {
      url += `/${promotion.temp.temp_id}`;
      // Keeping as POST to match Vuex behavior
    }

    const res = await method(url, payload.form, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });

    if (payload.search) {
      await dispatch(listPromotions(payload.search));
    }

    dispatch({ type: "PROMOTION_SAVED" });
    return res;
  } catch (err) {
    dispatch({ type: "PROMOTION_EDIT_END" });
    throw err;
  }
};

// Action to cancel editing
export const cancelEditPromotion = () => dispatch => {
  dispatch({ type: "PROMOTION_EDIT_END" });
};

export const destroyPromotion = payload => async dispatch => {
  try {
    const res = await axios.delete(`admin/promotion/${payload.id}`);
    dispatch(listPromotions(payload.search));
    return res;
  } catch (err) {
    throw err;
  }
};

export const changePromotionImage = payload => async dispatch => {
  try {
    const res = await axios.post(
      `admin/promotion/change-image/${payload.id}`,
      payload.form,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );
    dispatch({ type: "PROMOTION_SHOW", payload: res.data });
    return res;
  } catch (err) {
    throw err;
  }
};

export const exportPromotions = payload => async dispatch => {
  try {
    const res = await axios.get(`admin/promotion/export`, {
      params: payload,
      responseType: "blob"
    });
    return res;
  } catch (err) {
    throw err;
  }
};
