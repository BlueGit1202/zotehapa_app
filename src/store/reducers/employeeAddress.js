const initialState = {
  lists: [],
  page: {},
  pagination: [],
  show: {},
  temp: {
    temp_id: null,
    isEditing: false,
  },
};

export const employeeAddressReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_EMPLOYEE_ADDRESS_LISTS':
      return {
        ...state,
        lists: action.payload,
      };
    case 'SET_EMPLOYEE_ADDRESS_PAGINATION':
      return {
        ...state,
        pagination: action.payload,
      };
    case 'SET_EMPLOYEE_ADDRESS_PAGE':
      return {
        ...state,
        page: {
          from: action.payload.from,
          to: action.payload.to,
          total: action.payload.total,
        },
      };
    case 'SET_EMPLOYEE_ADDRESS_SHOW':
      return {
        ...state,
        show: action.payload,
      };
    case 'SET_EMPLOYEE_ADDRESS_TEMP':
      return {
        ...state,
        temp: {
          temp_id: action.payload,
          isEditing: true,
        },
      };
    case 'RESET_EMPLOYEE_ADDRESS_TEMP':
      return {
        ...state,
        temp: {
          temp_id: null,
          isEditing: false,
        },
      };
    default:
      return state;
  }
};