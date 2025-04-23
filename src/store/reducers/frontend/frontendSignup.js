const initialState = {
  phone: {},
  email: {},
  formData: {},
  loading: false,
  error: null,
  verificationRequired: false,
  verificationType: null // 'phone' or 'email'
};

export const frontendSignupReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SIGNUP_REQUEST":
      return {
        ...state,
        loading: true,
        error: null
      };

    case "OTP_PHONE_SUCCESS":
      return {
        ...state,
        phone: { otp: action.payload },
        loading: false,
        verificationRequired: true,
        verificationType: "phone"
      };

    case "OTP_EMAIL_SUCCESS":
      return {
        ...state,
        email: { otp: action.payload },
        loading: false,
        verificationRequired: true,
        verificationType: "email"
      };

    case "SIGNUP_VALIDATION_SUCCESS":
      return {
        ...state,
        formData: action.payload,
        phone: { ...state.phone, ...action.payload },
        email: { ...state.email, ...action.payload },
        loading: false
      };

    case "SIGNUP_SUCCESS":
      return {
        ...state,
        loading: false,
        verificationRequired: false,
        verificationType: null
      };

    case "SIGNUP_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    case "RESET_SIGNUP":
      return initialState;

    default:
      return state;
  }
};
