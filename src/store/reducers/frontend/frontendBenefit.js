const initialState = {
  lists: [],
  page: 1,
  hasMore: true,
  loading: false,
  error: null,
  temp: {
    isEditing: false,
    temp_id: null
  },
  show: null
};

export default function frontendBenefitReducer(state = initialState, action) {
  switch (action.type) {
    case "BENEFIT_LISTS":
      return {
        ...state,
        lists: action.payload.data,
        loading: false,
        error: null
      };

    case "BENEFIT_SHOW":
      return {
        ...state,
        show: action.payload,
        loading: false,
        error: null
      };

    case "BENEFIT_TEMP":
      return {
        ...state,
        temp: {
          ...state.temp,
          ...action.payload
        }
      };

    case "BENEFIT_RESET":
      return {
        ...state,
        temp: initialState.temp
      };

    case "FETCH_BENEFITS_REQUEST":
      return {
        ...state,
        loading: true,
        error: null
      };

    case "FETCH_BENEFITS_SUCCESS":
      return {
        ...state,
        lists: action.payload.page === 1 
          ? action.payload.data 
          : [...state.lists, ...action.payload.data],
        page: action.payload.page,
        hasMore: action.payload.hasMore,
        loading: false,
        error: null
      };

    case "FETCH_BENEFITS_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    default:
      return state;
  }
}