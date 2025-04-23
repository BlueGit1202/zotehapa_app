const initialState = {
  lists: {},
  language_id: null,
  language_code: "en",
  display_mode: "light"
};

export const globalReducer = (state = initialState, action) => {
  switch (action.type) {
    case "global/init":
      return {
        ...state,
        lists: {
          ...state.lists,
          ...Object.fromEntries(
            Object.entries(action.payload).filter(([key]) => !state.lists[key])
          )
        }
      };
    case "global/lists":
      return { ...state, lists: { ...state.lists, ...action.payload } };
    case "SET_LANGUAGE":
      return {
        ...state,
        language_id: action.payload.language_id,
        language_code: action.payload.language_code,
        display_mode: action.payload.display_mode
      };

    // Add other global state actions as needed
    case "UPDATE_GLOBAL_STATE":
      return { ...state, ...action.payload };

    case "SET_LOADING":
      return { ...state, loading: action.payload };

    default:
      return state;
  }
};
