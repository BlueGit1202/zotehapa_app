// reducers/frontend/frontendProductReview.js
const initialState = {
  show: {},
  temp: {
    temp_id: null,
    isEditing: false,
  },
};

export const frontendProductReviewReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_PRODUCT_REVIEW':
      return {
        ...state,
        show: action.payload
      };
    case 'SET_TEMP_REVIEW':
      return {
        ...state,
        temp: {
          temp_id: action.payload,
          isEditing: true
        }
      };
    case 'RESET_REVIEW':
      return {
        ...state,
        temp: {
          temp_id: null,
          isEditing: false
        }
      };
    default:
      return state;
  }
};