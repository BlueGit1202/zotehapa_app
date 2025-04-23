const initialState = {
  lists: [],
  pagination: {},
  page: {},
  show: {},
  temp: {
    temp_id: null,
    isEditing: false
  },
  loading: false,
  errors: {}
};

const smsGatewayReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'smsGateway/listsRequest':
      return {
        ...state,
        loading: true
      };
    case 'smsGateway/listsSuccess':
      return {
        ...state,
        loading: false,
        lists: action.payload.data,
        pagination: action.payload,
        page: {
          from: action.payload.meta?.from,
          to: action.payload.meta?.to,
          total: action.payload.meta?.total
        }
      };
    case 'smsGateway/listsFailure':
      return {
        ...state,
        loading: false,
        errors: action.payload
      };
    case 'smsGateway/saveRequest':
      return {
        ...state,
        loading: true
      };
    case 'smsGateway/saveSuccess':
      return {
        ...state,
        loading: false,
        temp: {
          temp_id: action.payload.id,
          isEditing: true
        }
      };
    case 'smsGateway/saveFailure':
      return {
        ...state,
        loading: false,
        errors: action.payload
      };
    case 'smsGateway/reset':
      return {
        ...state,
        temp: {
          temp_id: null,
          isEditing: false
        },
        errors: {}
      };
    default:
      return state;
  }
};

export default smsGatewayReducer;