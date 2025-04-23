const initialState = {
  lists: [],
  page: {},
  pagination: [],
  show: {},
  temp: {
    temp_id: null,
    isEditing: false
  }
};

export default function pushNotificationReducer(state = initialState, action) {
  switch (action.type) {
    case "SET_PUSH_NOTIFICATION_LISTS":
      return {
        ...state,
        lists: action.payload
      };
    case "SET_PUSH_NOTIFICATION_PAGINATION":
      return {
        ...state,
        pagination: action.payload
      };
    case "SET_PUSH_NOTIFICATION_PAGE":
      if (action.payload) {
        return {
          ...state,
          page: {
            from: action.payload.from,
            to: action.payload.to,
            total: action.payload.total
          }
        };
      }
      return state;
    case "SET_PUSH_NOTIFICATION_SHOW":
      return {
        ...state,
        show: action.payload
      };
    case "SET_PUSH_NOTIFICATION_TEMP":
      return {
        ...state,
        temp: {
          ...state.temp,
          temp_id: action.payload,
          isEditing: true
        }
      };
    case "RESET_PUSH_NOTIFICATION":
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
}
