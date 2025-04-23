const initialState = {
  lists: [],
  show: null,
  pagination: {},
  temp: {
    isEditing: false,
    temp_id: null,
    data: null
  },
  loading: {
    isActive: false,
    isEditing: false,
    isSaving: false
  }
};

export default function promotionReducer(state = initialState, action) {
  switch (action.type) {
    case "PROMOTION_LIST":
      return {
        ...state,
        lists: action.payload.data,
        pagination: action.payload.meta,
        loading: { ...state.loading, isActive: false }
      };

    case "PROMOTION_SHOW":
      return {
        ...state,
        show: action.payload.data,
        loading: { ...state.loading, isActive: false }
      };

    case "PROMOTION_LOADING":
      return { ...state, loading: { ...state.loading, isActive: true } };

    case "PROMOTION_EDIT_START":
      return {
        ...state,
        temp: {
          isEditing: true,
          temp_id: action.payload.id,
          data: action.payload.data
        },
        loading: { ...state.loading, isEditing: true }
      };

    case "PROMOTION_EDIT_END":
      return {
        ...state,
        temp: { isEditing: false, temp_id: null, data: null },
        loading: { ...state.loading, isEditing: false }
      };

    case "PROMOTION_SAVING":
      return { ...state, loading: { ...state.loading, isSaving: true } };

    case "PROMOTION_SAVED":
      return {
        ...state,
        temp: { isEditing: false, temp_id: null, data: null },
        loading: { ...state.loading, isSaving: false }
      };

    case "SET_LOADING": // ← This case will execute
      return {
        ...state,
        loading: { ...state.loading, isActive: action.payload }
      }; // becomes true

    default:
      return state;
  }
}
