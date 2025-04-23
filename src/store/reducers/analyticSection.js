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

export const analyticSectionReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ANALYTIC_SECTION_LISTS":
      return {
        ...state,
        lists: action.payload.data,
        page: action.payload.meta,
        pagination: action.payload
      };
    case "ANALYTIC_SECTION_SHOW":
      return {
        ...state,
        show: action.payload.data
      };
    case "ANALYTIC_SECTION_TEMP":
      return {
        ...state,
        temp: {
          temp_id: action.payload,
          isEditing: true
        }
      };
    case "ANALYTIC_SECTION_RESET":
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
