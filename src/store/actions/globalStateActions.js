export const initGlobal = payload => dispatch => {
  if (typeof payload === "object") {
    dispatch({ type: "global/init", payload });
    return payload;
  }
  throw new Error("Payload must be an object");
};

export const setGlobal = payload => dispatch => {
  if (typeof payload === "object") {
    dispatch({ type: "global/lists", payload });
    return payload;
  }
  throw new Error("Payload must be an object");
};

export const changeLanguage = (id, code, mode) => async dispatch => {
  try {
    await dispatch({
      type: "SET_LANGUAGE",
      payload: { language_id: id, language_code: code, display_mode: mode }
    });

    // You might want to reload translations here
  } catch (error) {
    console.error("Language change error:", error);
    throw error;
  }
};
