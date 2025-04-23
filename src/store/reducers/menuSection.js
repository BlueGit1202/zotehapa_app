const initialState = {
  lists: [],
  pagination: {},
  page: {},
  temp: { temp_id: null, isEditing: false }
};

export const menuSectionReducer = (state = initialState, action) => {
  switch (action.type) {
    case "MENU_SECTION/SET_LISTS":
      return {
        ...state,
        lists: action.payload.data,
        pagination: action.payload,
        page: action.payload.meta
      };
    case "MENU_SECTION/SET_TEMP":
      return { ...state, temp: { temp_id: action.payload, isEditing: true } };
    case "MENU_SECTION/RESET_TEMP":
      return { ...state, temp: initialState.temp };
    default:
      return state;
  }
};
