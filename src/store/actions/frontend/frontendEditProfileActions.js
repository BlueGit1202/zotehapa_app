import axios from "axios";

export const updateProfile = payload => async dispatch => {
  try {
    const res = await axios.post('/profile', payload);
    dispatch({ type: "UPDATE_PROFILE", payload: res.data.data });
    console.log("update profile:", res.data.data);
    return res;
    
  } catch (err) {
    throw err;
  }
};

export const changePassword = payload => async dispatch => {
  try {
    const res = await axios.put(`profile/change-password`, payload);
    dispatch({ type: "UPDATE_PROFILE", payload: res.data.data });
    return res;
  } catch (err) {
    throw err;
  }
};

export const updateProfileImage = formData => async dispatch => {
  try {
    const response = await axios.post(
      "profile/change-image",
      formData
    );
    dispatch({ type: "UPDATE_PROFILE_IMAGE", payload: response.data.data });
    return response.data;
  } catch (error) {
    console.error("Profile image update error:", error);
    throw error;
  }
};
