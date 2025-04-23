const initialState = {
  lists: [],
  page: {},
  pagination: [],
  show: {},
  temp: {
    temp_id: null,
    isEditing: false
  },
  fileList: [],
  fileText: {}
};

export const languageReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LANGUAGE_LISTS":
      return {
        ...state,
        lists: action.payload.data,
        page: action.payload.meta,
        pagination: action.payload
      };
    case "LANGUAGE_SHOW":
      return {
        ...state,
        show: action.payload
      };
    case "LANGUAGE_TEMP":
      return {
        ...state,
        temp: {
          temp_id: action.payload,
          isEditing: true
        }
      };
    case "LANGUAGE_RESET":
      return {
        ...state,
        temp: {
          temp_id: null,
          isEditing: false
        }
      };
    case "LANGUAGE_FILE_LIST":
      return {
        ...state,
        fileList: action.payload
      };
    case "LANGUAGE_FILE_TEXT":
      return {
        ...state,
        fileText: action.payload
      };
    case "LANGUAGE_RESET_FILE_TEXT":
      return {
        ...state,
        fileText: {}
      };
    default:
      return state;
  }
};
