import axios from "axios";

export const profile = () => async dispatch => {
  try {
    const res = await axios.get("/profile");
    dispatch({ type: "SET_AUTH_INFO", payload: res.data.data });
    return Promise.resolve(res);
  } catch (err) {
    return Promise.reject(err);
  }
};

export const login = payload => async dispatch => {
  try {
    const res = await axios.post("auth/login", payload);
    dispatch({ type: "AUTH_LOGIN", payload: res.data });
    return Promise.resolve(res);
  } catch (err) {
    return Promise.reject(err);
  }
};

export const authCheck = () => async (dispatch, getState) => {
  try {
    const res = await axios.post("auth/authcheck");
    if (res.data.status === false) {
      dispatch({ type: "AUTH_LOGOUT" });
    }
    return Promise.resolve(res);
  } catch (err) {
    return Promise.reject(err);
  }
};

export const logout = () => async dispatch => {
  try {
    await axios.post("auth/logout");
    dispatch({ type: "AUTH_LOGOUT" });
    return Promise.resolve();
  } catch (err) {
    return Promise.reject(err);
  }
};

export const forgotPassword = payload => async dispatch => {
  try {
    const res = await axios.post("auth/forgot-password", payload);
    dispatch({ type: "SET_RESET_INFO", payload });
    return Promise.resolve(res);
  } catch (err) {
    return Promise.reject(err);
  }
};

// Verification actions
export const verifyPhone = payload => async dispatch => {
  try {
    const res = await axios.post("auth/forgot-password/verify-phone", payload);
    return Promise.resolve(res);
  } catch (err) {
    return Promise.reject(err);
  }
};

export const verifyEmail = payload => async dispatch => {
  try {
    const res = await axios.post("auth/forgot-password/verify-email", payload);
    return Promise.resolve(res);
  } catch (err) {
    return Promise.reject(err);
  }
};

// OTP actions
export const otpPhone = payload => async dispatch => {
  try {
    const res = await axios.post("auth/forgot-password/otp-phone", payload);
    dispatch({ type: "SET_PHONE", payload });
    return Promise.resolve(res);
  } catch (err) {
    return Promise.reject(err);
  }
};

export const otpEmail = payload => async dispatch => {
  try {
    const res = await axios.post("auth/forgot-password/otp-email", payload);
    dispatch({ type: "SET_EMAIL", payload });
    return Promise.resolve(res);
  } catch (err) {
    return Promise.reject(err);
  }
};

export const resetPassword = payload => async dispatch => {
  try {
    const res = await axios.post(
      "auth/forgot-password/reset-password",
      payload
    );
    dispatch({ type: "AUTH_LOGIN", payload: res.data });
    return Promise.resolve(res);
  } catch (err) {
    return Promise.reject(err);
  }
};

export const updateAuthInfo = payload => async (dispatch, getState) => {
  try {
    const { authInfo } = getState().auth;
    if (authInfo.id === payload.id) {
      dispatch({ type: "SET_AUTH_INFO", payload });
      return Promise.resolve(payload);
    }
    throw new Error("User data does not match");
  } catch (err) {
    return Promise.reject(err);
  }
};

export const signupLoginVerify = payload => async dispatch => {
  try {
    const res = await axios.post("auth/signup/login-verify", payload);
    dispatch({ type: "AUTH_LOGIN", payload: res.data });
    return Promise.resolve(res);
  } catch (err) {
    return Promise.reject(err);
  }
};

// Login data reset (clears auth state)
export const loginDataReset = () => ({ type: "AUTH_LOGOUT" });

// Reset phone/email verification state
export const resetVerification = () => ({ type: "RESET_AUTH" });
export const resetAuth = () => ({ type: "RESET_AUTH" });
