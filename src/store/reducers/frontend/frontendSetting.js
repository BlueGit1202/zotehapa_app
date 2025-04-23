const initialState = {
  lists: [],
  loading: false,
  error: null
};

export default function settingReducer(state = initialState, action) {
  switch (action.type) {
    case "SETTING_REQUEST":
      return { ...state, loading: true, error: null };
    case "FETCH_SETTINGS_SUCCESS":
      return { ...state, loading: false, lists: action.payload };
    case "SETTING_FAILURE":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}
