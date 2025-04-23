const initialState = {
  authStatus: false,
  authToken: null,
  authInfo: {},
  authMenu: [],
  resetInfo: { email: null },
  authPermission: {},
  authDefaultPermission: {},
  phone: {},
  email: {}
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "AUTH_LOGIN":
      return {
        ...state,
        authStatus: true,
        authToken: action.payload.token,
        authInfo: action.payload.user,
        authMenu: action.payload.menu,
        authPermission: action.payload.permission,
        authDefaultPermission: action.payload.defaultPermission
      };
    case "AUTH_LOGOUT":
      return initialState; // Reset to initial state completely
    case "SET_AUTH_INFO":
      return {
        ...state,
        authInfo: action.payload
      };
    case "SET_PHONE":
      return {
        ...state,
        phone: { ...state.phone, ...action.payload } // Merge payload with existing phone state
      };
    case "SET_EMAIL":
      return {
        ...state,
        email: { ...state.email, ...action.payload } // Merge payload with existing email state
      };
    case "SET_RESET_INFO":
      return {
        ...state,
        resetInfo: { email: action.payload.email }
      };
    case "RESET_AUTH":
      return {
        ...state,
        phone: {},
        email: {},
        resetInfo: { email: null }
      };
    default:
      return state;
  }
};
