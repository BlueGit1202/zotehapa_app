const initialState = {
  profile: {},
  loading: {
    isActive: false
  }
};

export default function frontendEditProfileReducer(
  state = initialState,
  action
) {
  switch (action.type) {
    case "UPDATE_PROFILE":
      return {
        ...state,
        profile: action.payload,
        loading: {
          isActive: false
        }
      };
    case "FRONTEND_EDIT_PROFILE_LOADING":
      return {
        ...state,
        loading: {
          isActive: true
        }
      };
    default:
      return state;
  }
}
