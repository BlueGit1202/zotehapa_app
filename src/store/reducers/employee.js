const initialState = {
  lists: [],
  page: {},
  pagination: [],
  show: {},
  temp: {
    temp_id: null,
    isEditing: false,
  },
  myOrders: [],
  orderPage: {},
  orderPagination: [],
};

export const employeeReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_EMPLOYEE_LISTS":
      return {
        ...state,
        lists: action.payload
      };
    case "SET_EMPLOYEE_PAGE":
      return {
        ...state,
        page: action.payload
      };
    case "SET_EMPLOYEE_PAGINATION":
      return {
        ...state,
        pagination: action.payload
      };
    case "SET_EMPLOYEE_SHOW":
      return {
        ...state,
        show: action.payload
      };
    case "SET_EMPLOYEE_TEMP":
      return {
        ...state,
        temp: {
          temp_id: action.payload,
          isEditing: true
        }
      };
    case "RESET_EMPLOYEE_TEMP":
      return {
        ...state,
        temp: {
          temp_id: null,
          isEditing: false
        },
        show: {}
      };
    case 'RESET_EMPLOYEE_TEMP':
      return {
        ...state,
        temp: {
          temp_id: null,
          isEditing: false,
        },
      };
    case 'SET_EMPLOYEE_MY_ORDERS':
      return {
        ...state,
        myOrders: action.payload,
      };
    case 'SET_EMPLOYEE_ORDER_PAGINATION':
      return {
        ...state,
        orderPagination: action.payload,
      };
    case 'SET_EMPLOYEE_ORDER_PAGE':
      return {
        ...state,
        orderPage: {
          from: action.payload.from,
          to: action.payload.to,
          total: action.payload.total,
        },
      };
    default:
      return state;
  }
};