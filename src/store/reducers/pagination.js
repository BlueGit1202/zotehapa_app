const initialState = {
  current_page: 1,
  data: [],
  from: 0,
  last_page: 1,
  per_page: 10,
  to: 0,
  total: 0
};

const paginationReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_PAGINATION_DATA':
      return {
        ...state,
        ...action.payload
      };
    case 'RESET_PAGINATION':
      return initialState;
    default:
      return state;
  }
};

export default paginationReducer;