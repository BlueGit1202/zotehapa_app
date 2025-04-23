import appService from "../../../services/appService";

const initialState = {
  lists: [],
  page: {},
  show: {},
  edit: {},
  pagination: [],
  temp: {
    temp_id: null,
    isEditing: false
  }
};

export const damageReducer = (state = initialState, action) => {
  switch (action.type) {
    case "DAMAGE_LISTS":
      return {
        ...state,
        lists: action.payload.data,
        page: action.payload.meta,
        pagination: action.payload
      };
    case "DAMAGE_SHOW":
      return {
        ...state,
        show: action.payload.data
      };
    case "DAMAGE_EDIT":
      return {
        ...state,
        edit: action.payload.data,
        temp: {
          temp_id: action.payload.id,
          isEditing: true
        }
      };
    case "DAMAGE_RESET":
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
