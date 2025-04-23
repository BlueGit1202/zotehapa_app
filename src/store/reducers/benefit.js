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

export const benefitReducer = (state = initialState, action) => {
  switch (action.type) {
    case "BENEFIT_LISTS":
      return {
        ...state,
        lists: action.payload.data,
        page: action.payload.meta,
        pagination: action.payload
      };
    case "BENEFIT_SHOW":
      return { ...state, show: action.payload.data };
    case "BENEFIT_TEMP":
      return { ...state, temp: { temp_id: action.payload, isEditing: true } };
    case "BENEFIT_RESET":
      return { ...state, temp: { temp_id: null, isEditing: false } };
    case "SET_LOADING": // Add specific loading action
      return { ...state, loading: action.payload };

    default:
      return state;
  }
};
