const initialState = {
  lists: [],
};

export const notificationAlertReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION_ALERT_DATA':
      return {
        ...state,
        lists: action.payload,
      };
    default:
      return state;
  }
};